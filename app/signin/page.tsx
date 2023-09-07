'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import { signInWithProviders, getAllProviders } from './_utils'
import Loading from '../loading'
import type { ClientSafeProvider } from 'next-auth/react'

const SignIn = () => {
  const { status } = useSession()
  const router = useRouter()
  const redirect = useSearchParams().get('redirect') ?? ''

  useEffect(() => {
    if (status === 'authenticated') router.push(`/${redirect}`)
  }, [status, router, redirect])

  const [userData, setUserData] = useState<UserSignInData>({
    email: '',
    password: '',
  })

  const updateUserData =
    (type: keyof UserSignInData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    }

  const providers = useQuery({
    queryKey: ['providers'],
    queryFn: getAllProviders,
  })

  const mutation = useMutation(signInWithProviders)

  const onSignIn = (provider: ClientSafeProvider) => {
    mutation.mutate({ provider, userData })
  }

  if (providers.isLoading) return <Loading />
  if (mutation.isLoading) return <div>Attemping to sign in...</div>
  if (mutation.isSuccess)
    return <div>Sign in was successful. Redirecting now!</div>
  return (
    <>
      <div>
        <Link href={'/signup'}>Create an account</Link>
      </div>
      <form>
        <input
          name='email'
          type='text'
          placeholder='Enter Email'
          value={userData.email}
          onChange={updateUserData('email')}
        />
        <input
          name='current-password'
          type='password'
          placeholder='Enter Password'
          value={userData.password}
          onChange={updateUserData('password')}
        />
      </form>
      <div>
        <p>{mutation.isError ? (mutation.error as Error).message : null}</p>
      </div>
      <div>
        {providers.data &&
          providers.data.map((provider) => (
            <div key={provider.name}>
              <button
                disabled={mutation.isLoading || mutation.isSuccess}
                onClick={() => onSignIn(provider)}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        <p>{providers.error ? (providers.error as Error).message : null}</p>
      </div>
    </>
  )
}

export default SignIn
