'use client'

import { getProviders, signIn, useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const SignIn = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? ''

  const { status } = useSession()
  useEffect(() => {
    if (status === 'authenticated') router.push(`/${redirect}`)
  }, [router, status, redirect])

  const [providers, setProviders] = useState<ProvidersType>(null)
  const [userData, setUserData] = useState<UserSignInData>({
    email: '',
    password: '',
  })
  const [signInError, setSignInError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    getProviders().then((providers) => setProviders(providers))
  }, [])

  const updateUserDataHandler = useCallback(
    (type: keyof UserSignInData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    },
    [userData]
  )

  const formHandler = useCallback(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
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
    },
    [userData, router, redirect]
  )

  return (
    <>
      <form onSubmit={formHandler()}>
        <input
          name='email'
          type='text'
          placeholder='Enter Email'
          value={userData.email}
          onChange={updateUserDataHandler('email')}
        />
        <input
          name='current-password'
          type='password'
          placeholder='Enter Password'
          value={userData.password}
          onChange={updateUserDataHandler('password')}
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
        {providers &&
          Object.values(providers)
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

export default SignIn
