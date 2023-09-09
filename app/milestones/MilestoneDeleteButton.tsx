'use client'

import { useMutation } from '@tanstack/react-query'
import React, { FC } from 'react'

const MilestoneDeleteButton: FC<MilestoneDeleteData> = ({
  id,
  documentPath,
}) => {
  const mutation = useMutation(deleteMilestoneAndDocument)

  const onClickDelete = () => {
    mutation.mutate({ id, documentPath })
  }

  return <button onClick={onClickDelete}>Delete</button>
}

export default MilestoneDeleteButton

export const deleteMilestoneAndDocument = async ({
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
    // todo: call revalidate api - pass in path, secret validation token
    // todo: redirect back to milestones page
    return data
  } else {
    throw new Error(error!)
  }
}
