import CustomSession from '@/app/_server_utils/customSession'
import React from 'react'
import { redirect } from 'next/navigation'
import prisma from '@/prisma/db'
import { Milestone } from '@prisma/client'

type TProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: TProps) {
  const session = await CustomSession.getServerSession()

  if (!session) {
    redirect(`/signin?redirect=milestones/${params.id}`)
  }

  return <div>page</div>
}

export async function findMilestone({
  milestoneId,
}: {
  milestoneId: string
}): Promise<{
  success: boolean
  data: Milestone | string
  error: string
}> {
  try {
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
      },
    })

    if (!milestone) {
      throw Error('No Milestone Found')
    }

    return {
      success: true,
      data: milestone,
      error: '',
    }
  } catch (err) {
    console.error('Error Milestones [id]: ' + String(err))

    return {
      success: false,
      data: '',
      error: String(err),
    }
  }
}
