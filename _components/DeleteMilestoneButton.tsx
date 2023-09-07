'use client'

import { useMutation } from '@tanstack/react-query'
import React, { FC } from 'react'

type TProps = {
  id: string
  documentPath: string | null
}

const deleteMilestone = (id: string, documentPath: string | null) => {
  const mutation = useMutation()
}

const DeleteMilestoneButton: FC<TProps> = ({ id, documentPath }) => {
  return (
    <button onClick={() => deleteMilestone(id, documentPath)}>Delete</button>
  )
}

export default DeleteMilestoneButton
