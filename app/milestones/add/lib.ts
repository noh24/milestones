import Helper from "@/lib/helper"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

export const createMilestone = async ({
  milestoneData,
  router
}: {
  milestoneData: MilestoneData
  router: AppRouterInstance
}) => {
  if (milestoneData.document.type) {
    if (!Helper.validateType(milestoneData.document.type)) {
      throw new Error(
        "Submitted document's type is not an acceptable MIME type. "
      )
    }
  }

  const formData = new FormData()
  Object.entries(milestoneData).forEach((keyValuePair) => {
    formData.set(keyValuePair[0], keyValuePair[1])
  })

  const res = await fetch('api/milestones', {
    method: 'POST',
    body: formData,
  })

  const { success, data, error }: MilestoneApiResponse = await res.json()

  if (!res.ok) {
    throw new Error(error!)
  } else {
    setTimeout(() => router.push('/milestones'), 3000)
    return data
  }
}