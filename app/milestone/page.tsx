'use client'

import React, { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useCallback } from 'react'
import Image from 'next/image'

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
  const [preview, setPreview] = useState<string>('')

  useEffect(() => console.log(milestoneData), [milestoneData])

  useEffect(() => {
    if (milestoneData.document && milestoneData.document.length != 0) {
      console.log(milestoneData.document[0])
      const fileURL = URL.createObjectURL(milestoneData.document[0])
      setPreview(() => fileURL)
    }
  }, [milestoneData.document])

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
        document: event.target.files,
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
          value={milestoneData.title}
          onChange={updateMilestoneDataHandler('title')}
        />
        <textarea
          name='content'
          placeholder='Enter milestone details'
          value={milestoneData.content}
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
            onChange={updateMilestoneDocumentHandler()}
          />
        </label>
        <div>
          {preview ? (
            <Image src={preview} alt='' width={300} height={500} />
          ) : (
            <div></div>
          )}
        </div>
      </form>
    </>
  )
}

export default Milestone
