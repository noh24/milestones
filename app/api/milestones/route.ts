import prisma from "@/prisma/db"
import { NextResponse } from 'next/server'
import { deleteMilestoneDocumentAsync, parseFormData, uploadDocumentHandler } from "./_utils"

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

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()
    const userId = formData.get('userId') as string
    const milestoneId = formData.get('id') as string
    const milestoneData = parseFormData(formData)

    const existingMilestone = await prisma.milestone.findFirstOrThrow({
      where: {
        userId
      },
    })

    // existing has no document -> new has new document = upload new document
    // existing has no document -> new has no document = move on

    // existing has document -> new has no document = delete old document
    // existing has document -> new has document = delete old & update new
    let documentPath: string = ''

    switch (true) {
      case existingMilestone.document.length > 1:
        if (milestoneData.document) {
          // delete then upload
          documentPath = await uploadDocumentHandler(milestoneData.document as unknown as File)
        } else {
          // delete old
        }
        break
      case existingMilestone.document.length === 0:
        if (milestoneData.document) {
          // upload new
        }
        break
    }

    await prisma.milestone.update({
      where: {
        id: milestoneId
      },
      data: {
        ...milestoneData,
        userId,
        document: documentPath
      },
    })

    return NextResponse.json({
      success: true,
      data: 'Successfully updated milestone!',
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