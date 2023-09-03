'use client'

import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import OAuthProviders from './OAuthProviders'

const SignIn = () => {
  const router = useRouter()
  const redirect = useSearchParams().get('redirect') ?? null
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') router.push(`/${redirect}`)
  }, [router, status, redirect])

  const [userData, setUserData] = useState<UserSignInData>({
    email: '',
    password: '',
  })

  const [signInError, setSignInError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const updateUserData =
    (type: keyof UserSignInData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    }

  const formHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading((prevState) => !prevState)
    setMessage('')

    const result = await signIn('credentials', {
      email: userData.email,
      password: userData.password,
      callbackUrl: '/',
      redirect: false,
    })

    setLoading((prevState) => !prevState)

    if (result?.error) {
      setSignInError(true)
      setMessage('The password or email you have entered is invalid.')
    } else {
      router.push(`${result?.url!}/${redirect}`)
    }
  }

  return (
    <>
      <form onSubmit={formHandler}>
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
        <button type='submit' disabled={loading}>
          Sign in with Credentials
        </button>
      </form>
      <div>
        <p className={signInError ? 'block' : 'hidden'}></p>
        <p>{message}</p>
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
