import React from 'react'
import Link from 'next/link'
import { getAllMilestones } from './_server_utils'
import MilestoneDeleteButton from '@/app/milestones/MilestoneDeleteButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Milestones - Milestones',
}

export default async function Milestones() {
  const data = await getAllMilestones()

  if (data?.error) return <div>{String(data.error)}</div>
  if (data?.success && data?.data!.length === 0) {
    return (
      <>
        <Link href='/milestones/add'>Add Milestones</Link>
        <div>
          There are no milestones associated to this account. Please add your
          first milestone!
        </div>
      </>
    )
  }
  return (
    <>
      <div>
        {data?.data!.map(({ id, title, content, type, date }) => (
          <div key={id}>
            <Link href={`/milestones/${id}`}>
              <h2>{title}</h2>
              <p>{type}</p>
              <p>{content}</p>
              <p>{new Date(date).toDateString()}</p>
            </Link>
            <MilestoneDeleteButton id={id} />
            <Link
              href={{
                pathname: `/milestones/${id}/edit`,
                query: { id },
              }}
            >
              Update
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
