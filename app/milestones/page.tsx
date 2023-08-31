import { getServerSession } from 'next-auth'
import React, { FC } from 'react'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Milestones: FC = async () => {
  const session = await getSession()
  const data = await getMilestones(session?.user?.email!)
  return <div>Milestones</div>
}

export default Milestones

const getSession = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return
  }
  return session
}

const getMilestones = async (email: string) => {
  const res = await fetch('http://localhost:3000/api/milestones')

  return res.json()
}
