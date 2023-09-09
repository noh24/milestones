import prisma from "@/prisma/db"
import { NextResponse } from 'next/server'
import { parseFormData, uploadDocumentHandler } from "./_utils"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const userEmail = formData.get('userEmail') as string

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: userEmail
      },
      select: {
        id: true
      }
    })

    const milestoneData = parseFormData(formData)

    let documentPath: string = ''

    if (milestoneData.document) {
      documentPath = await uploadDocumentHandler(milestoneData.document as unknown as File)
    }

    await prisma.milestone.create({
      data: {
        ...milestoneData,
        userId: user.id,
        document: documentPath
      },
    })

    return NextResponse.json({ success: true, data: 'Congratulations on a new milestone!', error: null }, { status: 200 })
  } catch (err) {
    console.log('Milestone Post Route', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, absoluteDocumentPath }: MilestoneDeleteData = await req.json()

    // this will throw an exception if it fails - don't need to throw on yourself
    await prisma.milestone.delete({
      where: {
        id,
      }
    })

    if (absoluteDocumentPath) {
      
    }

    return NextResponse.json({ success: true, data: 'Successfully deleted milestone!', error: null }, { status: 200 })
  } catch (err) {
    console.log('Milestone Delete Route', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }

}