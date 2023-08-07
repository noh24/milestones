import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getProviders } from 'next-auth/react'

const Login = async () => {
  await getSession()

  return <div>Login</div>
}

export default Login

async function getSession() {
  const session = await getServerSession(authOptions)

  if (session) redirect('/')

  const providers = getProviders()
  console.log(providers)

  return {
    props: { providers: providers ?? [] },
  }
}
