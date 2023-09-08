import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import type { Session } from 'next-auth'
import prisma from "@/prisma/db"
import Helper from "@/_utils/helper"

export const deleteMilestoneAndDocument = async ({
  id,
  documentPath,
}: MilestoneDeleteData) => {
  const res = await fetch('/api/milestone', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, documentPath }),
  })

  const { success, data, error }: DeleteMilestoneApiResponse = await res.json()

  if (res.ok) {
    // todo: call revalidate api - pass in path, secret validation token
    // todo: redirect back to milestones page
    return data
  } else {
    throw new Error(error!)
  }
}

export const getMilestones = async (): Promise<GetMilestoneApiResponse> => {
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

const getSession = async (): Promise<Session> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/signin?redirect=milestones')
  }

  return session
}
