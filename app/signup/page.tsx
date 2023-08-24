'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Helper from '@/lib/helper'

const initialUserData: UserData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const SignUp = () => {
  const router = useRouter()

  const { data: session } = useSession()
  if (session) {
    router.push('/')
  }

  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [error, setError] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const updateUserDataHandler = useCallback(
    (type: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData((prevData) => ({ ...prevData, [type]: event.target.value }))
    },
    []
  )

  useEffect(() => {
    if (Helper.confirmPassword(userData)) {
      setError((prevState) => !prevState)
    } else {
      setError((prevState) => !prevState)
    }
  }, [userData])

  const formHandler = useCallback(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading((prevState) => !prevState)
      setMessage('')

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            password: userData.password,
          }),
        })
        setLoading((prevState) => !prevState)

        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setMessage(data.success)

        setTimeout(() => router.push('/signIn'), 3000)
      } catch (error) {
        setMessage(`${error}`)
      }
    },
    [userData, router]
  )

  return (
    <>
      <form onSubmit={formHandler()}>
        <input
          name='full-name'
          type='text'
          placeholder='Enter your full name'
          required
          value={userData.name}
          onChange={updateUserDataHandler('name')}
        />
        <input
          name='email'
          type='text'
          placeholder='Enter your email'
          required
          value={userData.email}
          onChange={updateUserDataHandler('email')}
        />
        <input
          name='current-password'
          type='password'
          placeholder='Enter your password'
          required
          value={userData.password}
          onChange={updateUserDataHandler('password')}
        />
        <input
          name='confirm-password'
          type='password'
          placeholder='Re-enter your password'
          required
          value={userData.confirmPassword}
          onChange={updateUserDataHandler('confirmPassword')}
        />
        <button type='submit' disabled={error || loading}>
          Create account
        </button>
      </form>
      <div>
        <p className={message ? 'block' : 'hidden'}>{message}</p>
        <p className={error ? 'block' : 'hidden'}>Passwords must match!</p>
      </div>
    </>
  )
}

export default SignUp
