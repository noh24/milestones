import prisma from "@/prisma/db"
import { GetOneMilestoneResponse } from "@/types/types"

export async function getOneMilestone(
  milestoneId: string
): Promise<GetOneMilestoneResponse> {
  try {
    const milestone = await prisma.milestone.findFirstOrThrow({
      where: {
        id: milestoneId,
      },
    })

    return {
      success: true,
      data: milestone,
      error: null,
    }
  } catch (err) {
    console.log('getOneMilestone: ', err)

    return {
      success: false,
      data: null,
      error: String(err),
    }
  }
}
