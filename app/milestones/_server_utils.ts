import Helper from "@/_utils/helper"
import { headers } from 'next/headers'
import { redirect } from "next/navigation"

export async function getAllMilestones(): Promise<GetMilestoneApiResponse | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/milestones`, {
    method: 'GET',
    headers: headers(),
    cache: 'no-cache'
  })

  const { success, data, error }: GetMilestoneApiResponse = await res.json()

  switch (res.status) {
    case 401:
      redirect('/signin?redirect=milestones')
    case 400:
      return {
        success: false,
        data: null,
        error: Helper.sanitizeErrorMessage(String(error))
      }
    case 200:
      return {
        success,
        data,
        error
      }
  }
}