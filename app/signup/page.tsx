'use client'

import React, { FormEventHandler, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type UserData = {
  name: string
  email: string
  password: string
}

const initialUserData = {
  name: '',
  email: '',
  password: '',
}

const SignUp = () => {
  const router = useRouter()

  const { data: session } = useSession()
  if (session) {
    router.push('/')
  }

  const [userData, setUserData] = useState<UserData>(initialUserData)

  const updateUserDataHandler = useCallback(
    (type: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [type]: event.target.value })
    },
    [userData]
  )

  const formHandler = useCallback(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    },
    []
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

export default SignUp
