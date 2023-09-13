import SignUpForm from './SignUpForm'
import { Metadata } from 'next'
import CustomSession from '../_server_utils/customSession'

export const metadata: Metadata = {
  title: 'Sign Up - Milestones',
}

export default async function Page() {
  await CustomSession.getSessionAndRedirectIfSession()
  return <SignUpForm />
}
