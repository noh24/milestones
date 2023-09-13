import SignInForm from './SignInForm'
import CustomSession from '../_server_utils/customSession'
import { Metadata } from 'next'
import { getAllProviders } from './_utils'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Sign In - Milestones',
}

export default async function Page() {
  const session = await CustomSession.getServerSession()

  if (session) {
    redirect('/')
  }

  const providers = await getAllProviders()

  return <SignInForm providers={providers} />
}
