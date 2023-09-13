import SignUpForm from './SignUpForm'
import { Metadata } from 'next'
import CustomSession from '../_server_utils/customSession'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Sign Up - Milestones',
}

export default async function Page() {
  const session = await CustomSession.getServerSession()

  if (session) {
    redirect('/')
  }

  return <SignUpForm />
}
