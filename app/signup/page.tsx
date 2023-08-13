'use client'

import React, { FormEventHandler, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { POST as signUp } from '../api/auth/signup/route'

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

  const updateUserDataHandler = useCallback(
    (type: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    },
    [userData]
  )

  const formHandler = useCallback(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const confirmedPassword = isConfirmedPassword(userData)

      if (!confirmedPassword) {
        return setError({ ...error, passwordError: true })
      }

      const result = await signUp({
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        },
      })

      if (result.error) {
        return setError({ ...error, signUpError: true })
      }

      setMessage(result.message!)
    },
    [userData, error]
  )

  return (
    <>
      <form>
        <input
          name='full-name'
          type='text'
          placeholder='Enter your full name'
        />
        <input name='email' type='text' placeholder='Enter your email' />
        <input
          name='current-password'
          type='password'
          placeholder='Enter your password'
        />
        <input
          name='confirm-password'
          type='password'
          placeholder='Re-enter your password'
        />
        <button type='submit'>Create account</button>
      </form>
      <div>
        <p></p>
      </div>
    </>
  )
}

const isConfirmedPassword = (userData: UserData): boolean => {
  return userData.password === userData.confirmPassword
}

export default SignUp
