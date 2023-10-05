import { CreateMilestoneFormData, EditMilestoneFormData, MilestoneApiResponse } from "@/types/types"
import Helper from "./../_utils/helper"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

// DELETE
export async function deleteMilestoneAndDocument({
  id,
  router
}: {
  id: string,
  router: AppRouterInstance
}) {
  const res = await fetch('/api/milestones', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })

  const { success, data, error }: MilestoneApiResponse = await res.json()

  if (!res.ok) {
    throw new Error(error!)
  }

  setTimeout(() => {
    router.prefetch('/milestones')
    router.push('/milestones')
  }, 1500)

  Helper.revalidatePath({ path: 'milestones' })

  return data
}

// CREATE
export async function createMilestone({
  milestoneData,
  router
}: {
  milestoneData: CreateMilestoneFormData,
  router: AppRouterInstance
}) {
  const formData = new FormData()

  Object.entries(milestoneData).forEach((kvp) => formData.set(kvp[0], kvp[1]!))

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

  Helper.revalidatePath({ path: 'milestones' })

  return data
}

// UPDATE
export async function updateMilestone({
  milestoneData,
  router
}: {
  milestoneData: EditMilestoneFormData,
  router: AppRouterInstance
}) {
  const formData = new FormData()

  Object.entries(milestoneData).forEach((kvp) => formData.set(kvp[0], kvp[1]!))

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
    router.prefetch(`/milestones/${milestoneData.id}/edit`)
    router.push('/milestones')
  }, 1500)

  Helper.revalidatePath({ path: 'milestones' })
  Helper.revalidatePath({ path: `milestones/${milestoneData.id}/edit` })

  return data
}

