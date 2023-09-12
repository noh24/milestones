import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import SignUpForm from './SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Milestones',
}

const getSessionOrRedirect = async () => {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }
}

export default async function SignUp() {
  await getSessionOrRedirect()
  return <SignUpForm />
}
