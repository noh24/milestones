'use client'

import React, { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useCallback } from 'react'
import Helper from '@/lib/helper'

// clean up component
// rid of useeffect console.log
// test out form submit handler
// create loading , error, message state

const initialMilestoneData: MilestoneData = {
  title: '',
  content: '',
  type: '',
  date: '',
}

const Milestones: FC = () => {
  const { data: session } = useSession()
  console.log(session)
  if (!session) redirect('/signin?redirect=milestones/add')

  const [milestoneData, setMilestoneData] =
    useState<MilestoneData>(initialMilestoneData)

  useEffect(() => console.log(milestoneData), [milestoneData])

  const updateMilestoneDataHandler = useCallback(
    (type: keyof MilestoneData) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setMilestoneData((prevState) => ({
          ...prevState,
          [type]: event.target.value,
        })),
    []
  )
  const updateMilestoneDocumentHandler = useCallback(
    () => (event: React.ChangeEvent<HTMLInputElement>) =>
      setMilestoneData((prevState) => ({
        ...prevState,
        document: event.target.files![0],
      })),
    []
  )

  const submitHandler = useCallback(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      try {
        const { document } = milestoneData
        if (document) {
          const isValid = Helper.validateType(document.type)
          if (!isValid)
            throw new Error('Document type is not acceptable MIME type.')
        }

        const response = await fetch('/api/milestones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(milestoneData),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)

        setTimeout(() => redirect('/milestones'), 3000)
      } catch (err) {
        console.log(err)
      }
    },
    [milestoneData]
  )

  return (
    <>
      <form onSubmit={submitHandler()}>
        <input
          name='title'
          type='text'
          placeholder='Title'
          required
          value={milestoneData.title}
          onChange={updateMilestoneDataHandler('title')}
        />
        <label>
          Select Date:
          <input
            name='date'
            type='date'
            required
            value={milestoneData.date}
            onChange={updateMilestoneDataHandler('date')}
          />
        </label>
        <textarea
          name='content'
          placeholder='Enter details'
          required
          value={milestoneData.content}
          onChange={updateMilestoneDataHandler('content')}
        />
        <label>
          <input
            name='type'
            type='radio'
            required
            checked
            value='professional'
            onChange={updateMilestoneDataHandler('type')}
          />
          Professional
        </label>
        <label>
          <input
            name='type'
            type='radio'
            value='personal'
            onChange={updateMilestoneDataHandler('type')}
          />
          Personal
        </label>
        <label>
          Upload an image or file:
          <input
            name='document'
            type='file'
            accept='.doc,.docx,.pdf,.jpeg,.png'
            onChange={updateMilestoneDocumentHandler()}
          />
        </label>
        <button type='submit'>Add Milestone</button>
      </form>
    </>
  )
}

export default Milestones
