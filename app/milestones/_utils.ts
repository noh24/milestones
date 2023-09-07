// import { Session } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import type { Session } from 'next-auth'
import prisma from "@/prisma/db"
import Helper from "@/_utils/helper"


const getSession = async (): Promise<Session> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/signin?redirect=milestones')
  }

  return session
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