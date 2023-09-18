'use client'

import Loading from '@/app/loading'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { updateMilestone } from '../../_utils'
import { Milestone } from '@prisma/client'
import { MilestoneFormData } from '@/types/types'
import Helper from '@/app/_utils/helper'

type TProps = {
  milestone: Milestone
}

export default function MilestoneEditForm({ milestone }: TProps) {
  const router = useRouter()

  const [milestoneData, setMilestoneData] = useState<MilestoneFormData>({
    title: milestone.title,
    content: milestone.content,
    type: milestone.type,
    date: milestone.date.toISOString().split('T')[0],
    document: milestone.document ? milestone.document : '',
    id: milestone.id,
  })

  const onUpdateMilestoneData =
    (type: keyof MilestoneFormData) =>
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
      document: event.target.files![0] || (milestone.document ?? ''),
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
        <label>
          Upload a document (Maximum file size: 5MB):
          <span>.pdf</span>
          <span>.doc / .docx</span>
          <span>.jpeg / .png </span>
          <input
            name='document'
            type='file'
            accept='.doc,.docx,.pdf,.jpeg,.png,.jpg'
            onChange={onUpdateMilestoneDocument}
            className={'hidden'}
          />
        </label>
        <div>
          <p>
            {milestoneData.document ? 'Current File: ' : 'No File Uploaded'}
          </p>
          <p>
            {milestoneData.document
              ? (milestoneData.document as File).name ??
                Helper.sanitizeDocumentName(milestoneData.document as string)
              : null}
          </p>
        </div>
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
