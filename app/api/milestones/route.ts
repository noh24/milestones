import prisma from "@/prisma/db"
import { NextResponse } from 'next/server'
import { deleteMilestoneDocumentAsync, parseFormData, uploadDocumentHandler } from "./_utils"

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

    return NextResponse.json({
      success: true,
      data: 'Congratulations on a new milestone!',
      error: null
    }, {
      status: 200
    })
  } catch (err) {
    console.log('Milestone Api Route Post', err)


    return NextResponse.json({
      success: false,
      data: null,
      error: String(err)
    }, {
      status: 400
    })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json()

    // this will throw an exception if it fails 
    // don't need to throw on yourself
    const { document } = await prisma.milestone.delete({
      where: {
        id,
      },
      select: {
        document: true
      },
    })

    if (document) {
      deleteMilestoneDocumentAsync(document)
    }

    return NextResponse.json({
      success: true,
      data: 'Successfully deleted milestone!',
      error: null
    }, {
      status: 200
    })
  } catch (err) {
    console.log('Milestone Api Route Delete', err)

    return NextResponse.json({
      success: false,
      data: null,
      error: String(err)
    }, {
      status: 400
    })
  }

}