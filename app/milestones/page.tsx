import React from 'react'
import Link from 'next/link'
import { getAllMilestones } from './_serverUtils'
import MilestoneDeleteButton from '@/app/milestones/MilestoneDeleteButton'
import { Metadata } from 'next'
import CustomSession from '../_server_utils/customSession'
import { redirect } from 'next/navigation'
import { Milestone } from '@prisma/client'
import { MilestoneApiResponse } from '@/types/types'

export const metadata: Metadata = {
  title: 'All Milestones - Milestones',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const session = await CustomSession.getServerSession()

  if (!session) {
    redirect('/signin?redirect=milestones')
  }

  const { success, data, error }: MilestoneApiResponse = await getAllMilestones(session?.user?.email!)

  if (error) return <div>{String(error)}</div>
  if (success && (data as Milestone[]).length === 0) {
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
        {(data as Milestone[]).map(({ id, title, content, type, date }) => (
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
              }}
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
