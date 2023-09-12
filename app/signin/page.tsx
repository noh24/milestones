import SignInForm from './SignInForm'
import CustomSession from '../_server_utils/customSession'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Milestones',
}

export default async function SignIn() {
  await CustomSession.getSessionAndRedirectIfSession()
  return <SignInForm />
}
