import prisma from "@/prisma/db"
import { NextResponse } from 'next/server'
import { deleteMilestoneDocumentAsync, parseFormData, uploadDocumentHandler } from "./_utils"
import { Milestone } from "@prisma/client"

export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json()

    // this will throw an exception if it fails 
    // don't need to throw on yourself
    const deletedMilestone = await prisma.milestone.delete({
      where: {
        id,
      },
      select: {
        document: true
      },
    })

    if (deletedMilestone.document) {
      deleteMilestoneDocumentAsync(deletedMilestone.document)
    }

    return NextResponse.json({
      success: true,
      data: deletedMilestone,
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

    const newMilestone = await prisma.milestone.create({
      data: {
        ...milestoneData,
        userId: user.id,
        document: documentPath
      },
    })

    return NextResponse.json({
      success: true,
      data: newMilestone,
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

    let documentPath: string = ''

    let updatedMilestone: Milestone

    // milestone doc -> existing or new or none
    // existing doc -> real file path
    // document path -> empty or real file path

    // existing doc -> new doc = upload new, delete old
   // existing doc -> exisiting doc = nothing

    // no doc -> new doc = 
    // no doc -> no doc = do nothing

    switch (true) {
      case existingMilestone.document.length > 1:
        if (existingMilestone.document !== milestoneData.document) {
          documentPath = await uploadDocumentHandler(milestoneData.document as unknown as File)
          deleteMilestoneDocumentAsync(existingMilestone.document)
        } else {
          // wip: need to figure out how to update on different scenarios
          // might have to make db piece optional
          updatedMilestone = await prisma.milestone.update({
            where: {
              id: milestoneId
            },
            data: {
              ...milestoneData,
              userId,
            },
          })
        }
        
        break
      case existingMilestone.document.length === 0:
        if (milestoneData.document) {
          documentPath = await uploadDocumentHandler(milestoneData.document as unknown as File)
        }
        break
    }

    updatedMilestone = await prisma.milestone.update({
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
      data: updatedMilestone,
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