'use client'

import { redirect } from 'next/navigation'
import { getProviders, signIn, useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'

type UserData = {
  email: string
  password: string
}

const initialUserData: UserData = {
  email: '',
  password: '',
}

const Login = () => {
  const { data: session } = useSession()

  if (session) {
    redirect('/')
  }

  const [providers, setProviders] = useState<ProvidersType>(null)

  useEffect(() => {
    getProviders().then((providers) => setProviders(providers))
  }, [])

  const [userData, setUserData] = useState<UserData>(initialUserData)

  const updateUserDataHandler = useCallback(
    (type: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    },
    [userData]
  )

  const formHandler = useCallback(
    () => (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      signIn('credentials', {
        email: userData.email,
        password: userData.password,
      })
    },
    [userData]
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
        <button type='submit'>Sign in with Credentials</button>
      </form>
      <div></div>
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
