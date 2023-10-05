import prisma from "@/prisma/db"
import { MilestoneApiResponse } from "@/types/types"

export async function getOneMilestone(
  milestoneId: string
): Promise<MilestoneApiResponse> {
  try {
    const milestone = await prisma.milestone.findFirstOrThrow({
      where: {
        id: milestoneId,
      },
    })

    return {
      success: true,
      data: milestone,
      error: '',
    }
  } catch (err) {
    console.log('getOneMilestone: ', err)

    return {
      success: false,
      data: '',
      error: String(err),
    }
  }
}
