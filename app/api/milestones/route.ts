import prisma from "@/db"
import Helper from "@/lib/helper"
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Get
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error('You must login')

    const user = await prisma.user.findFirstOrThrow({ where: { email: String(session.user?.email) }, select: { id: true } })

    const milestones = await prisma.milestone.findMany({
      where: {
        userId: user!.id
      }
    })

    return NextResponse.json({ success: true, data: milestones, error: null }, { status: 200 })
  } catch (err) {
    console.log('Milestones Get Route: ', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}

// Post
export async function POST(req: Request) {
  const res = await req.formData()
  const userEmail = res.get('userEmail') as string
  const formData = {
    title: res.get('title') as string,
    content: res.get('content') as string,
    type: res.get('type') as string,
    date: new Date(res.get('date') as string).toISOString(),
    document: res.get('document') as File | null,
  }

  try {
    const user = await prisma.user.findFirstOrThrow({ where: { email: userEmail }, select: { id: true } })

    let documentPath: string | null = null

    if (formData.document) {
      const isValid = Helper.validateType(formData.document?.type)
      if (!isValid) throw new Error('Document type is not acceptable MIME type.')

      const arrayBuffer = await formData.document.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      documentPath = Helper.generateUploadPath() + Helper.generateFileExtension(formData.document.type)
      await writeFile(documentPath, buffer)
    }

    const newMilestone = await prisma.milestone.create({
      data: {
        ...formData,
        userId: user.id,
        document: documentPath
      }
    })

    return NextResponse.json({ success: true, data: newMilestone, error: null }, { status: 200 })
  } catch (err) {
    console.log('Milestone Add Route', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}