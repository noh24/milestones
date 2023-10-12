import prisma from "@/prisma/db"
import { NextResponse } from 'next/server'
import { handleDocumentDelete, parseCreateFormData, handleDocumentUpdate, handleDocumentUpload, parseEditFormData } from "./_utils"

export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json()

    const deletedMilestone = await prisma.milestone.delete({
      where: {
        id,
      },
      select: {
        documentName: true,
        documentPath: true,
      },
    })

    if (!deletedMilestone) {
      throw Error('No Milestone To Delete!')
    }

    if (deletedMilestone.documentPath) {
      handleDocumentDelete(deletedMilestone.documentPath)
    }

    return NextResponse.json({
      success: true,
      data: deletedMilestone.documentName,
      error: ''
    }, {
      status: 200
    })
  } catch (err) {
    console.log('Milestone Api Route Delete', err)

    return NextResponse.json({
      success: false,
      data: '',
      error: String(err)
    }, {
      status: 400
    })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const milestoneData = parseCreateFormData(formData)
    const userEmail = formData.get('userEmail') as string
    const file = formData.get('document') as File | string
    let documentPath: string = ''

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: userEmail
      },
      select: {
        id: true
      }
    })

    if (!user) {
      throw Error('Invalid User!')
    }

    if (file) {
      documentPath = await handleDocumentUpload(file as unknown as File)
    }

    const newMilestone = await prisma.milestone.create({
      data: {
        ...milestoneData,
        userId: user.id,
        documentPath: documentPath,
        documentName: (file as File).name ?? ""
      },
    })

    return NextResponse.json({
      success: true,
      data: newMilestone,
      error: ''
    }, {
      status: 200
    })
  } catch (err) {
    console.log('Milestone Api Route Post', err)

    return NextResponse.json({
      success: false,
      data: '',
      error: String(err)
    }, {
      status: 400
    })
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()
    const milestoneData = parseEditFormData(formData)

    const existingMilestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneData.id,
      },
    })

    if (!existingMilestone) {
      throw Error("This Milestone does not exist.")
    }
    // If New Document present, update Existing Milestone's document data
    if (milestoneData.document) {
      milestoneData.documentPath = await handleDocumentUpdate(existingMilestone, milestoneData)
      milestoneData.documentName = (milestoneData.document as File).name
    }

    const updatedMilestone = await prisma.milestone.update({
      where: {
        id: milestoneData.id
      },
      data: {
        title: milestoneData.title,
        content: milestoneData.content,
        type: milestoneData.type,
        date: milestoneData.date,
        documentPath: milestoneData.documentPath ?? '',
        documentName: milestoneData.documentName ?? ''
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedMilestone,
      error: ''
    }, {
      status: 200
    })

  } catch (err) {
    console.log('Milestone Api Route Put', err)

    return NextResponse.json({
      success: false,
      data: '',
      error: String(err)
    }, {
      status: 400
    })
  }
}

