'use client'

import React, { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Helper from '@/lib/helper'
import { useMutation } from '@tanstack/react-query'

const AddMilestones: FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated')
      router.push('/signin?redirect=milestones/add')
  }, [status, router])

  const [milestoneData, setMilestoneData] = useState<MilestoneData>({
    title: '',
    content: '',
    type: '',
    date: '',
    document: null,
    userEmail: session?.user?.email!,
  })

  const onUpdateMilestoneData =
    (type: keyof MilestoneData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setMilestoneData((prevState) => ({
        ...prevState,
        [type]: event.target.value,
      }))

  const onUpdateMilestoneDocument =
    () => (event: React.ChangeEvent<HTMLInputElement>) =>
      setMilestoneData((prevState) => ({
        ...prevState,
        document: event.target.files![0],
      }))

  const createMilestone = async ({
    milestoneData,
  }: {
    milestoneData: MilestoneData
  }) => {
    if (milestoneData.document.type) {
      if (!Helper.validateType(milestoneData.document.type)) {
        throw new Error(
          "Submitted document's type is not an acceptable MIME type. "
        )
      }
    }

    const formData = new FormData()
    Object.entries(milestoneData).forEach((keyValuePair) => {
      formData.set(keyValuePair[0], keyValuePair[1])
    })

    const res = await fetch('api/milestones', {
      method: 'POST',
      body: formData,
    })

    const { success, data, error }: MilestoneApiResponse = await res.json()

    if (!res.ok) {
      throw new Error(error!)
    } else {
      setTimeout(() => router.push('/milestones'), 3000)
      return data
    }
  }

  const mutation = useMutation(createMilestone)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ milestoneData })
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
          Upload an image or file:
          <input
            name='document'
            type='file'
            accept='.doc,.docx,.pdf,.jpeg,.png,.jpg'
            onChange={onUpdateMilestoneDocument()}
          />
        </label>
        <button type='submit'>Add Milestone</button>
      </form>
    </>
  )
}

export default AddMilestones
