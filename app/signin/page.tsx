'use client'

import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import OAuthProviders from './OAuthProviders'

const SignIn = () => {
  const { status } = useSession()
  const router = useRouter()
  const redirect = useSearchParams().get('redirect') ?? ''

  // useEffect(() => {
  //   if (status === 'authenticated') router.push(`/${redirect}`)
  // }, [router, status, redirect])

  const [userData, setUserData] = useState<UserSignInData>({
    email: '',
    password: '',
  })

  const updateUserData =
    (type: keyof UserSignInData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    }

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await signIn('credentials', {
        email: userData.email,
        password: userData.password,
        callbackUrl: '/',
        redirect: false,
      })
      if (res?.error) {
        throw new Error('You have entered the wrong email or password.')
      }
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate()
  }

  const countRef = useRef(0)
  useEffect(() => {
    countRef.current++
    console.log(countRef, mutation)
  }, [mutation])
  
  if (mutation.isLoading) return (<div>Attemping to sign in...</div>)
  return (
    <>
      <form onSubmit={onSubmit}>
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
        <button
          type='submit'
          disabled={mutation.isLoading || mutation.isSuccess}
        >
          Sign in with Credentials
        </button>
      </form>
      <div>
        <p>{mutation.isError ? (mutation.error as Error).message : null}</p>
      </div>
      <div>
        <Link href={'/signup'}>Create an account</Link>
      </div>
      <div>
        <OAuthProviders />
      </div>
    </>
  )
}

export default SignIn
