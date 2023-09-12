import Helper from "@/_utils/helper"
import { headers } from 'next/headers'

export const getAllMilestones = async (): Promise<GetMilestoneApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/milestones`, {
      method: 'GET',
      headers: headers(),
    })

    const { success, data, error }: GetMilestoneApiResponse = await res.json()

    if (res.ok) {
      return {
        success,
        data,
        error
      }
    } else {
      throw Error(String(error))
    }

  } catch (err) {
    console.error('Milestone Route getMilestones Error: ', err)

    return {
      success: false,
      data: null,
      error: Helper.sanitizeErrorMessage(String(err))
    }
  }
}