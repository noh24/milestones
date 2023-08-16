'use client'

import { getProviders, signIn, useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type UserData = {
  email: string
  password: string
}

const initialUserData: UserData = {
  email: '',
  password: '',
}

const Login = () => {
  const router = useRouter()

  // Session
  const { data: session, status } = useSession()
  console.log(`this is in login page, session: ${session}, status: ${status}`)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [router, status])
  // /Session 

  const [providers, setProviders] = useState<ProvidersType>(null)
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [loginError, setLoginError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    getProviders().then((providers) => setProviders(providers))
  }, [])

  const updateUserDataHandler = useCallback(
    (type: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setLoginError(true)
        setMessage('The password or email you have entered is invalid.')
      } else {
        router.push(result?.url!)
      }
    },
    [userData, router]
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
        <p className={loginError ? 'block' : 'hidden'}></p>
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

export default Login
