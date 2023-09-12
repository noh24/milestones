import SignInForm from './SignInForm'
import CustomSession from '../_server_utils/customSession'

export default async function SignIn() {
  await CustomSession.getSessionAndRedirectIfSession()
  return <SignInForm />
}
