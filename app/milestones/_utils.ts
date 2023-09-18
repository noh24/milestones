import { MilestoneApiResponse, MilestoneFormData } from "@/types/types"
import Helper from "./../_utils/helper"

// DELETE
export async function deleteMilestoneAndDocument({
  id
}: {
  id: string,
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

  return data
}

// CREATE
export async function createMilestone({
  milestoneData
}: {
  milestoneData: MilestoneFormData,
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

  return data
}
// UPDATE
export async function updateMilestone({
  milestoneData
}: {
  milestoneData: MilestoneFormData,
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

  return data
}

