'use client'

import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createMilestone } from '../_utils'
import { useRouter } from 'next/navigation'
import Loading from '@/app/loading'
import { CreateMilestoneFormData } from '@/types/types'

type TProps = {
  userEmail: string
}

export default function MilestoneAddForm({ userEmail }: TProps) {
  const router = useRouter()

  const [milestoneData, setMilestoneData] = useState<CreateMilestoneFormData>({
    title: '',
    content: '',
    type: '',
    date: '',
    document: '',
    userEmail,
  })

  const onUpdateMilestoneData =
    (type: keyof CreateMilestoneFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setMilestoneData((prevState) => ({
        ...prevState,
        [type]: event.target.value,
      }))

  const onUpdateMilestoneDocument = (
    event: React.ChangeEvent<HTMLInputElement>
  ) =>
    setMilestoneData((prevState) => ({
      ...prevState,
      document: event.target.files![0] ?? '',
    }))

  const mutation = useMutation(createMilestone)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ milestoneData, router })
  }

  if (mutation.isLoading) {
    return <Loading />
  }

  if (mutation.isSuccess) {
    return <p>Successfully Created Milestone...</p>
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name='title'
          type='text'
          placeholder='Title'
          required
          value={milestoneData.title}
          onChange={onUpdateMilestoneData('title')}
        />
        <label>
          Select Date:
          <input
            name='date'
            type='date'
            required
            value={milestoneData.date}
            onChange={onUpdateMilestoneData('date')}
          />
        </label>
        <textarea
          name='content'
          placeholder='Enter details'
          required
          value={milestoneData.content}
          onChange={onUpdateMilestoneData('content')}
        />
        <label>
          <input
            name='type'
            type='radio'
            required
            value='professional'
            onChange={onUpdateMilestoneData('type')}
          />
          Professional
        </label>
        <label>
          <input
            name='type'
            type='radio'
            value='personal'
            onChange={onUpdateMilestoneData('type')}
          />
          Personal
        </label>
        <label>
          Upload a document (Maximum file size: 5MB):
          <span>.pdf</span>
          <span>.jpeg/.png </span>
          <input
            name='document'
            type='file'
            accept='.pdf,.jpeg,.png,.jpg'
            onChange={onUpdateMilestoneDocument}
            className='block'
          />
        </label>
        <button
          type='submit'
          disabled={mutation.isLoading || mutation.isSuccess}
        >
          Add Milestone
        </button>
      </form>
      <p>{mutation.isError ? (mutation.error as Error).message : null}</p>
    </>
  )
}
