import { getServerSession } from 'next-auth'
import React, { FC } from 'react'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import type { Session } from 'next-auth'
import type { Milestone } from '@prisma/client'
import prisma from '@/prisma/db'

const Milestones: FC = async () => {
  const data = await getMilestones()

  return (
    <>
      {data instanceof Error ? (
        <div>{String(data)}</div>
      ) : (
        <div>
          {data.map(({ id, title, content, type, document, date }) => (
            <div key={id}>
              <h2>{title}</h2>
              <p>{content}</p>
              <p>{type}</p>
              <p>{date.toDateString()}</p>
              <p>{document}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Milestones

const getSession = async (): Promise<Session> => {
  const session = await getServerSession(authOptions)
  console.log('milestones page session: ', session)

  if (!session) {
    redirect('/signin?redirect=milestones')
  }
  return session
}

const getMilestones = async (): Promise<Milestone[] | Error> => {
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

    return milestones
  } catch (err) {
    console.log('milestones page user:', err)
    return err as Error
  }
}
