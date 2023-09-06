import { getServerSession } from 'next-auth'
import React, { FC } from 'react'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import type { Session } from 'next-auth'
import prisma from '@/prisma/db'
import Helper from '@/_utils/helper'

const Milestones: FC = async () => {
  const { success, data, error } = await getMilestones()

  if (error) return <div>{String(error)}</div>
  if (success && data!.length === 0) {
    return (
      <div>
        There are no milestones associated to this account. Please add your
        first milestone!
      </div>
    )
  }
  return (
    <>
      <div>
        {data!.map(({ id, title, content, type, document, date }) => (
          <div key={id}>
            <h2>{title}</h2>
            <p>{content}</p>
            <p>{type}</p>
            <p>{date.toDateString()}</p>
            <p>{document}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Milestones

const getSession = async (): Promise<Session> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/signin?redirect=milestones')
  }

  return session
}

const getMilestones = async (): Promise<GetMilestoneApiResponse> => {
  const session = await getSession()
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: session.user?.email!,
      },
      select: {
        id: true,
      },
    })

    const milestones = await prisma.milestone.findMany({
      where: {
        userId: user.id,
      },
    })

    return {
      success: true,
      data: milestones,
      error: null,
    }
  } catch (err) {
    console.log('milestones page user:', err)
    return {
      success: false,
      data: null,
      error: Helper.sanitizeErrorMessage(String(err)),
    }
  }
}
