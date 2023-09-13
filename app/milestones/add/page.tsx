import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import CustomSession from '@/app/_server_utils/customSession'
import MilestoneAddForm from './MilestoneAddForm'

export const metadata: Metadata = {
  title: 'Add Milestones - Milestones',
}

export default async function Page() {
  const session = await CustomSession.getServerSession()

  if (!session) {
    redirect('/signin?redirect=milestones/add')
  }

  return <MilestoneAddForm userEmail={session?.user?.email!} />
}
