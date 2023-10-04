import prisma from "@/prisma/db"
import { NextResponse } from 'next/server'
import { handleDocumentDelete, parseFormData, handleDocumentUpdate, handleDocumentUpload } from "./_utils"
import { Milestone } from "@prisma/client"
import CustomPrisma from "@/app/_server_utils/customPrisma"

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
    const file = formData.get('document') as File | string

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

    const milestoneData = parseFormData(formData)

    let documentPath: string = ''

    if (file) {
      documentPath = await handleDocumentUpload(file as unknown as File)
    }

    const newMilestone = await prisma.milestone.create({
      data: {
        ...milestoneData,
        userId: user.id,
        documentPath: documentPath,
        documentName: (file as File).name
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
    const milestoneData = parseFormData(formData)
    milestoneData['id'] = formData.get('id') as string

    const existingMilestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneData.id,
      },
    })

    if (!existingMilestone) {
      throw Error("The Milestone Id Provided Has No Associated Milestone.")
    }

    const documentPath = await handleDocumentUpdate(existingMilestone, milestoneData)

    let updatedMilestone: Milestone

    if (documentPath) {
      updatedMilestone = await CustomPrisma.updateMilestoneWithDocument(milestoneData, documentPath)
    } else {
      updatedMilestone = await CustomPrisma.updateMilestoneWithoutDocument(milestoneData)
    }

    return NextResponse.json({
      success: true,
      data: updatedMilestone,
      error: null
    }, {
      status: 200
    })

  } catch (err) {
    console.log('Milestone Api Route Put', err)

    return NextResponse.json({
      success: false,
      data: null,
      error: String(err)
    }, {
      status: 400
    })
  }
}

