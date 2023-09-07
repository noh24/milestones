'use client'

import { useMutation } from '@tanstack/react-query'
import React, { FC } from 'react'
import { deleteMilestoneAndDocument } from './_utils'

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
