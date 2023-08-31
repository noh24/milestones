import prisma from "@/db"
import Helper from "@/lib/helper"
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Get
export async function GET(req: Request) {
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
    console.log('Milestones Get Error: ', err)
    return NextResponse.json({ success: false, data: null, error: `${err}` }, { status: 400 })
  }
}


// Post
export async function POST(req: Request) {
  const formData = await req.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const type = formData.get('type') as string
  const date = new Date(formData.get('date') as string).toISOString()
  const userEmail = formData.get('userEmail') as string
  const document: File | null = formData.get('document') as File

  try {
    const user = await prisma.user.findFirstOrThrow({ where: { email: userEmail }, select: { id: true } })

    let documentPath: string | null = null

    if (document) {
      const isValid = Helper.validateType(document?.type)
      if (!isValid) throw new Error('Document type is not acceptable MIME type.')

      const arrayBuffer = await document.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      documentPath = Helper.generateUploadPath() + Helper.generateFileExtension(document.type)
      await writeFile(documentPath, buffer)
    }

    const newMilestone = await prisma.milestone.create({
      data: {
        title,
        content,
        type,
        date,
        userId: user.id,
        document: documentPath
      }
    })

    return NextResponse.json({ success: 'Successfully created a milestone', data: newMilestone }, { status: 200 })
  } catch (err) {
    console.log('Milestone Add Route', err)
    return NextResponse.json({ error: `${err}` }, { status: 400 })
  }
}