'use client'

import React, { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Helper from '@/lib/helper'

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

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const formData = new FormData()
      formData.set('title', milestoneData.title)
      formData.set('content', milestoneData.content)
      formData.set('type', milestoneData.type)
      formData.set('date', milestoneData.date)
      formData.set('userEmail', session?.user?.email!)

      if (milestoneData.document) {
        const isValid = Helper.validateType(milestoneData.document.type)
        if (!isValid)
          throw new Error('Document type is not acceptable MIME type.')
        formData.set('document', milestoneData.document)
      }

      const response = await fetch('/api/milestones', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      if (response.ok) setTimeout(() => router.push('/milestones'), 3000)
    } catch (err) {
      console.log('client component milestones error', err)
    }
  }

  return (
    <>
      <form onSubmit={submitHandler}>
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
