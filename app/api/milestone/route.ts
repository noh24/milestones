import prisma from "@/db"
import Helper from "@/lib/helper"
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'

export async function GET(req: Request) {

}

export async function POST(req: Request) {
  const { title, content, type, date, document, userEmail } = await req.json()

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail
      }
    })

    if (!user) throw new Error('There is no user associated with email provided.')

    let documentPath: string | null = null

    if (document) {
      const isValid = Helper.validateType(document.type)
      if (!isValid) throw new Error('Document type is not acceptable MIME type.')

      const arrayBuffer = new ArrayBuffer(document)
      const buffer = Buffer.from(arrayBuffer)

      documentPath = Helper.generateUploadPath() + String(document.type)
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

    return NextResponse.json({ message: 'Successfully created a milestone', data: newMilestone }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: `${err}` }, { status: 400 })
  }
}