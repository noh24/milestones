import { getServerSession } from 'next-auth/next'
import { authOptions } from './../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getProviders } from 'next-auth/react'
import Providers from '../components/Providers'

const Login = async () => {
  const providers = await getSession()

  return (
    <>
      <Providers providers={providers} />
    </>
  )
}

async function getSession() {
  const session = await getServerSession(authOptions)

  if (session) redirect('/')

  const providers = await getProviders()

  return providers ?? {}
}

export default Login
