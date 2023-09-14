import { DeleteMilestoneApiResponse } from "@/types/types"
import { CreateMilestoneApiResponse, MilestoneFormData } from "@/types/types"
import Helper from "./../_utils/helper"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"


// DELETE
export async function deleteMilestoneAndDocument({ id }: { id: string }) {
  const res = await fetch('/api/milestones', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })

  const { success, data, error }: DeleteMilestoneApiResponse = await res.json()

  if (res.ok) {
    return data
  } else {
    throw new Error(error!)
  }
}

// CREATE
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
    setTimeout(() => {
      router.prefetch('/milestones')
      router.push('/milestones')
    }, 1500)

    await fetch(`/api/revalidate?path=milestones&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
      method: 'POST'
    })

    return data
  } else {
    throw new Error(Helper.sanitizeErrorMessage(error!))
  }
}