import { MilestoneApiResponse, MilestoneFormData } from "@/types/types"
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

  const { success, data, error }: MilestoneApiResponse = await res.json()

  if (res.ok) {
    return data
  } else {
    throw new Error(error!)
  }
}

// CREATE
export async function createMilestoneAndRevalidate({ milestoneData, router }: {
  milestoneData: MilestoneFormData,
  router: AppRouterInstance
}) {
  const formData = new FormData()

  Object.entries(milestoneData).forEach((kvp) => formData.set(kvp[0], kvp[1]))

  const res = await fetch('/api/milestones', {
    method: 'POST',
    body: formData,
  })

  const { success, data, error }: MilestoneApiResponse = await res.json()

  if (!res.ok) {
    throw new Error(Helper.sanitizeErrorMessage(error!))
  }

  setTimeout(() => {
    router.prefetch('/milestones')
    router.push('/milestones')
  }, 1500)

  await fetch(`/api/revalidate?path=milestones&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
    method: 'POST'
  })

  return data
}
// UPDATE
export async function updateMilestoneAndRevalidate({ milestoneData, router }: {
  milestoneData: MilestoneFormData,
  router: AppRouterInstance
}) {
  const formData = new FormData()

  Object.entries(milestoneData).forEach((kvp) => formData.set(kvp[0], kvp[1]))

  const res = await fetch('/api/milestones', {
    method: 'PUT',
    body: formData
  })

  const { success, data, error }: MilestoneApiResponse = await res.json()

  if (!res.ok) {
    throw new Error(Helper.sanitizeErrorMessage(error!))
  }

  setTimeout(() => {
    router.prefetch('/milestones')
    router.push('/milestones')
  }, 1500)

  await fetch(`/api/revalidate?path=milestones&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
    method: 'POST'
  })

  return data
}