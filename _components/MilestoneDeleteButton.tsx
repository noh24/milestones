'use client'

import { useMutation } from '@tanstack/react-query'
import React, { FC } from 'react'

const MilestoneDeleteButton: FC<MilestoneDeleteData> = ({
  id,
  documentPath,
}) => {
  const mutation = useMutation(deleteMilestoneAndDocument)

  const deleteMilestone = () => {
    mutation.mutate({ id, documentPath })
  }

  return <button onClick={deleteMilestone}>Delete</button>
}

export default MilestoneDeleteButton

const deleteMilestoneAndDocument = async ({
  id,
  documentPath,
}: MilestoneDeleteData) => {
  const res = await fetch('/api/milestone', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, documentPath }),
  })

  const { success, data, error }: DeleteMilestoneApiResponse = await res.json()

  if (res.ok) {
    return data
  } else {
    throw new Error(error!)
  }
}
