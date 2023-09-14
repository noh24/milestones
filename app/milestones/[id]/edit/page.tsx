import { redirect } from 'next/navigation'
import CustomSession from '@/app/_server_utils/customSession'
import { getOneMilestone } from './_serverUtils'
import MilestoneEditForm from './MilestoneEditForm'
import { GetOneMilestoneResponse } from '@/types/types'

export default async function Page({ params }: { params: { id: string } }) {
  const session = await CustomSession.getServerSession()

  if (!session) {
    redirect(`/signin?redirect=milestones/${params.id}/edit`)
  }

  const { success, data, error }: GetOneMilestoneResponse =
    await getOneMilestone(params.id)

  if (error) {
    return <div>{error}</div>
  }

  return <MilestoneEditForm milestone={data!} />
}
