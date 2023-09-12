'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { signInWithProviders } from './_utils'
import { ClientSafeProvider } from 'next-auth/react'
import Link from 'next/link'

type TProps = {
  providers: ClientSafeProvider[]
}

export default function SignInForm({ providers }: TProps) {
  const router = useRouter()

  const redirect = useSearchParams().get('redirect') ?? ''

  const [userData, setUserData] = useState<UserSignInData>({
    email: '',
    password: '',
  })

  const updateUserData =
    (type: keyof UserSignInData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    }

  const mutation = useMutation(signInWithProviders)

  const onSignIn = (provider: ClientSafeProvider) => {
    mutation.mutate({ provider, userData, router, redirect })
  }

  if (mutation.isLoading) {
    return <div>Attemping to sign in...</div>
  }

  if (mutation.isSuccess && mutation.data === 'Google') {
    return <div>Signing in with Google...</div>
  }

  if (mutation.isSuccess) {
    return <div>Sign in was successful. Redirecting now!</div>
  }

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
        {providers.map((provider) => (
          <div key={provider.name}>
            <button
              disabled={mutation.isLoading || mutation.isSuccess}
              onClick={() => onSignIn(provider)}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
