'use client'

import { getServerSession } from 'next-auth/next'
import { authOptions } from './../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getCsrfToken, getProviders, signIn, useSession } from 'next-auth/react'
import OAuthProviders from '../components/OAuthProviders'


const Login = () => {
  const data =  useSession()

  return (
    <>
      <form>
        <input name='email' type='text' placeholder='Enter Email' />
        <input name='password' type='password' placeholder='Enter Password' />
      </form>
      <div>
        {Object.values(providers)
          .filter((provider) => provider.name !== 'Credentials')
          .map((provider) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
      </div>
    </>
  )
}
const fetchProviders = async () => {
  const providers = await getProviders()

  return {
    credentials: providers!['credentials'],
    providers: providers
  }
}

export default Login
