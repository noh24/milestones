'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Helper from '@/lib/helper'

const SignUp = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') router.push('/')
  }, [status, router])

  const [userData, setUserData] = useState<UserSignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [localState, setLocalState] = useState({
    loading: false,
    success: false,
    error: false,
    message: '',
  })

  useEffect(() => {
    setLocalState((prevState) => ({
      ...prevState,
      error: userData.password !== userData.confirmPassword,
    }))
  }, [userData])

  const formHandler = () => async (event: React.FormEvent<HTMLFormElement>) => {
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

      setTimeout(() => router.push('/signin'), 3000)
    } catch (error) {
      setMessage(`${error}`)
    }
  }

  return (
    <>
      <form onSubmit={formHandler}>
        <input
          name='name'
          type='text'
          placeholder='Enter your name'
          required
          value={userData.name}
          onChange={(e) =>
            setUserData((prevState) => ({
              ...prevState,
              name: e.target.value,
            }))
          }
        />
        <input
          name='email'
          type='email'
          placeholder='Enter your email'
          required
          value={userData.email}
          onChange={(e) =>
            setUserData((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
        />
        <input
          name='password'
          type='password'
          placeholder='Enter your password'
          required
          value={userData.password}
          onChange={(e) =>
            setUserData((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        <input
          name='confirmPassword'
          type='password'
          placeholder='Re-enter your password'
          required
          value={userData.confirmPassword}
          onChange={(e) =>
            setUserData((prevState) => ({
              ...prevState,
              confirmPassword: e.target.value,
            }))
          }
        />
        <button type='submit' disabled={localState.error || localState.loading}>
          Create account
        </button>
      </form>
      <div>
        <p className={localState.message ? 'block' : 'hidden'}>
          {localState.message}
        </p>
        <p className={localState.error ? 'block' : 'hidden'}>
          Passwords must match!
        </p>
      </div>
    </>
  )
}

export default SignUp
