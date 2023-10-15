'use client'

import Loading from '@/app/loading'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { updateMilestone } from '../../_utils'
import { Milestone } from '@prisma/client'
import { EditMilestoneFormData } from '@/types/types'

type TProps = {
  milestone: Milestone
}

export default function MilestoneEditForm({ milestone }: TProps) {
  const router = useRouter()

  const [milestoneData, setMilestoneData] = useState<EditMilestoneFormData>({
    title: milestone.title,
    content: milestone.content,
    type: milestone.type,
    date: milestone.date.toISOString().split('T')[0],
    document: '',
    documentPath: milestone.documentPath ?? '',
    documentName: milestone.documentName ?? '',
    id: milestone.id,
  })

  const onUpdateMilestoneData =
    (type: keyof EditMilestoneFormData) =>
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

  const mutation = useMutation(updateMilestone)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ milestoneData, router })
  }

  if (mutation.isLoading) {
    return <Loading />
  }

  if (mutation.isSuccess) {
    return <p>Successfully Updated Milestone...</p>
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
            checked={milestoneData.type === 'professional' ? true : false}
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
            checked={milestoneData.type === 'personal' ? true : false}
            value='personal'
            onChange={onUpdateMilestoneData('type')}
          />
          Personal
        </label>
        <div>
          <p>Current File: </p>
          {/* Display If Old Document Name present AND Old Document NOT present */}
          <p>
            {milestoneData.documentName
              ? `C://Fake//Path//${milestoneData.documentName}`
              : 'No File Uploaded'}
          </p>
        </div>
        <label>
          Upload new document:
          <span className='block'>(Maximum file size: 5MB)</span>
          <div>
            <span>.pdf</span>
            <span>.jpeg/.jpg/.png </span>
          </div>
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
          Update Milestone
        </button>
      </form>
      <p>{mutation.isError ? (mutation.error as Error).message : null}</p>
    </>
  )
}
