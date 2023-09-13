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