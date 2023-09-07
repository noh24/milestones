import Helper from "@/_utils/helper"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

export const createMilestoneAndRevalidate = async ({
  milestoneData,
  router
}: {
  milestoneData: MilestoneFormData
  router: AppRouterInstance
}) => {
  const formData = new FormData()

  Object.entries(milestoneData).forEach((keyValuePair) => {
    formData.set(keyValuePair[0], keyValuePair[1])
  })

  const res = await fetch('/api/milestones', {
    method: 'POST',
    body: formData,
  })

  const { success, data, error }: CreateMilestoneApiResponse = await res.json()

  if (res.ok) {
    setTimeout(() => router.push('/milestones'), 3000)

    await fetch(`/api/revalidate?path=milestones&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
      method: 'POST'
    })

    return data
  } else {
    throw new Error(Helper.sanitizeErrorMessage(error!))
  }
}