'use client'

import React, { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useCallback } from 'react'

type MilestoneData = {
  title: string
  content: string
  type: string
  document?: any
}

const initialMilestoneData = {
  title: '',
  content: '',
  type: '',
}

const Milestone: FC = () => {
  const { data: session } = useSession()
  if (!session) redirect('/signin')

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

  return (
    <>
      <div>Add Milestones</div>
      <form>
        <input
          name='title'
          type='text'
          placeholder='Title'
          onChange={updateMilestoneDataHandler('title')}
        />
        <textarea
          name='content'
          placeholder='Enter milestone details'
          onChange={updateMilestoneDataHandler('content')}
        />
        <label>
          <input
            name='type'
            type='radio'
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
          Upload image or file:
          <input
            name='document'
            type='file'
            accept='.doc,.docx,.pdf,image/*'
            onChange={updateMilestoneDataHandler('document')}
          />
        </label>
      </form>
    </>
  )
}

export default Milestone
