import { redirect } from 'next/navigation'
import CustomSession from '@/app/_server_utils/customSession'
import { getOneMilestone } from './_utils'
import MilestoneEditForm from './MilestoneEditForm'

export default async function Page({ params }: { params: { id: string } }) {
  const session = await CustomSession.getServerSession()

  if (!session) {
    redirect(`/signin?redirect=milestones/${params.id}/edit`)
  }

  const { success, data, error } = await getOneMilestone(params.id)

  if (error) {
    return <div>{error}</div>
  }

  return (
    <MilestoneEditForm userEmail={session?.user?.email!} milestone={data!} />
  )
}
