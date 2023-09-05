import prisma from "@/prisma/db"
import Helper from "@/_utils/helper"
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'

export async function POST(req: Request): Promise<NextResponse<MilestoneApiResponse>> {
  try {
    const res = await req.formData()

    const formData = {
      title: res.get('title') as string,
      content: res.get('content') as string,
      type: res.get('type') as string,
      date: new Date(res.get('date') as string).toISOString(),
      document: res.get('document') as Blob | null,
    }
    const userEmail = res.get('userEmail') as string

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: userEmail
      },
      select: {
        id: true
      }
    })

    let documentPath: string = ''

    if (formData.document) {
      if (!Helper.validateType(formData.document?.type)) {
        throw new Error('Document type is not acceptable MIME type.')
      }

      if (Helper.validateDocumentSize(formData.document?.size)) {
        throw new Error('File is too large. Maximum file size is 5MB.')
      }

      const arrayBuffer = await formData.document.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      documentPath = Helper.generateUploadPath() + Helper.generateFileExtension(formData.document.type)
      await writeFile(documentPath, buffer)
    }

    await prisma.milestone.create({
      data: {
        ...formData,
        userId: user.id,
        document: documentPath
      }
    })

    return NextResponse.json({ success: true, data: 'Successfully added milestone!', error: null }, { status: 200 })
  } catch (err) {
    console.log('Milestone Add Route', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}