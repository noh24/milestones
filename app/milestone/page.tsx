'use client'

import React, { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useCallback } from 'react'

type MilestoneData = {
  title: string
  content: string
  type: string
  date: string
  document?: File
  // fileUrl?: string
}

const initialMilestoneData = {
  title: '',
  content: '',
  type: '',
  date: '',
}

const Milestone: FC = () => {
  const { data: session } = useSession()
  console.log(session)
  if (!session) redirect('/signin?redirect=milestone')

  const [milestoneData, setMilestoneData] =
    useState<MilestoneData>(initialMilestoneData)

  useEffect(() => console.log(milestoneData), [milestoneData])

  // useEffect(() => {
  //   if (milestoneData.document && milestoneData.document.length != 0) {
  //     const fileUrl = URL.createObjectURL(milestoneData.document)
  //     setMilestoneData((prevState) => ({ ...prevState, fileUrl: fileUrl }))
  //   }
  // }, [milestoneData.document])

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
    },
    []
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

export default Milestone
