'use client'

import Loading from '@/app/loading'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { createMilestoneAndRevalidate } from '../../add/_utils'

export default function Page() {
  const { data: session, status } = useSession()

  const router = useRouter()

  const { id } = useParams()

  useEffect(() => {
    console.log(id)
    if (status !== 'authenticated')
      router.push(`/signin?redirect=milestones/edit?id=${id}`)
  }, [status, router, id])

  // work in progress: check point
  const milestones = useQuery({
    queryKey: ['milestones'],
    queryFn: async () => {
      const res = await fetch(`/api/milestones/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.json()
    },
  })

  useEffect(() => console.log('milestones query:', milestones)), []

  const [milestoneData, setMilestoneData] = useState<MilestoneFormData>({
    title: '',
    content: '',
    type: '',
    date: '',
    document: '',
    userEmail: session?.user?.email!,
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
      document: event.target.files![0],
    }))

  const mutation = useMutation(createMilestoneAndRevalidate)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ milestoneData, router })
  }

  if (mutation.isLoading) return <Loading />
  if (mutation.isSuccess) return <div>{mutation.data}</div>
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
          <span>.doc / .docx</span>
          <span>.jpeg / .png </span>
          <input
            name='document'
            type='file'
            accept='.doc,.docx,.pdf,.jpeg,.png,.jpg'
            onChange={onUpdateMilestoneDocument}
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
