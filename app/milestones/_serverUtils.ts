import prisma from "@/prisma/db"
import { MilestoneApiResponse } from "@/types/types"

export async function getAllMilestones(userEmail: string): Promise<MilestoneApiResponse> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    })

    const milestones = await prisma.milestone.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: milestones,
      error: '',
    }

  } catch (err) {
    console.log('getAllMilestones', err)

    return {
      success: false,
      data: '',
      error: String(err),
    }
  }
}