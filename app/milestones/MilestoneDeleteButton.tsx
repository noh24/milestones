'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

const MilestoneDeleteButton: FC<MilestoneDeleteData> = ({ id }) => {
  const router = useRouter()

  const mutation = useMutation(deleteMilestoneAndDocument)

  const onClickDelete = () => {
    mutation.mutate({ id })

    // can't call revalidation api
    // nextjs revalidatePath() only revalidates on next visit
    router.refresh()
  }

  return <button onClick={onClickDelete}>Delete</button>
}

export default MilestoneDeleteButton

export const deleteMilestoneAndDocument = async ({
  id,
}: MilestoneDeleteData) => {
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
