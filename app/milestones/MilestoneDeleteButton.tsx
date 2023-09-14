'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { deleteMilestoneAndDocument } from './_utils'
import Loading from '../loading'

type TProps = {
  id: string
}

const MilestoneDeleteButton = ({ id }: TProps) => {
  const router = useRouter()

  const mutation = useMutation(deleteMilestoneAndDocument)

  const onClickDelete = () => {
    mutation.mutate({ id })

    // can't call revalidation api
    // nextjs revalidatePath() only revalidates on next visit
    router.refresh()
  }

  if (mutation.isLoading) {
    return <Loading />
  }
  return <button onClick={onClickDelete}>Delete</button>
}

export default MilestoneDeleteButton
