import prisma from "@/db"
import Helper from "@/lib/helper"
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'

export async function GET(req: Request) {

}

export async function POST(req: Request) {
  const formData = await req.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const type = formData.get('type') as string
  const date = new Date(formData.get('date') as string).toISOString()
  const userEmail = formData.get('userEmail') as string
  const document: File | null = formData.get('document') as File

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail
      }
    })

    if (!user) throw new Error('There is no user associated with email provided.')

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