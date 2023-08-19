'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type UserData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

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
  const [error, setError] = useState<{
    passwordError: boolean
    signUpError: boolean
  }>({ passwordError: false, signUpError: false })
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const updateUserDataHandler = useCallback(
    (type: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData((prevData) => ({ ...prevData, [type]: event.target.value }))
    },
    []
  )

  useEffect(() => {
    const confirmedPassword = isConfirmedPassword(userData)

    if (!confirmedPassword) {
      setError((prevState) => ({ ...prevState, passwordError: true }))
    } else {
      setError((prevState) => ({ ...prevState, passwordError: false }))
    }
  }, [userData])

  const formHandler = useCallback(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading((prevState) => !prevState)
      setError((prevState) => ({ ...prevState, signUpError: false }))
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

        if (!response.ok) throw new Error(data.message)

        setMessage(data.message)

        if (data.status !== 200) {
          return setError((prevState) => ({ ...prevState, signUpError: true }))
        }

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
        <button type='submit' disabled={error.passwordError || loading}>
          Create account
        </button>
      </form>
      <div>
        <p className={message ? 'block' : 'hidden'}>{message}</p>
        <p className={error.passwordError ? 'block' : 'hidden'}>
          Passwords must match!
        </p>
      </div>
    </>
  )
}

const isConfirmedPassword = (userData: UserData): boolean => {
  return userData.password === userData.confirmPassword
}

export default SignUp
