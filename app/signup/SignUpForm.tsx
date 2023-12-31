'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { signUpUser } from './_utils'
import Loading from '../loading'
import { useRouter } from 'next/navigation'
import { UserSignUpData } from '@/types/types'

export default function SignUpForm() {
  const router = useRouter()

  const [userData, setUserData] = useState<UserSignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const updateUserData =
    (type: keyof UserSignUpData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserData((prevState) => ({ ...prevState, [type]: e.target.value }))
    }

  const mutation = useMutation(signUpUser)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ userData, router })
  }

  if (mutation.isLoading) return <Loading />
  if (mutation.isSuccess) return <div>{mutation.data}</div>
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name='name'
          type='text'
          placeholder='Enter your name'
          required
          value={userData.name}
          onChange={updateUserData('name')}
        />
        <input
          name='email'
          type='email'
          placeholder='Enter your email'
          required
          value={userData.email}
          onChange={updateUserData('email')}
        />
        <input
          name='password'
          type='password'
          placeholder='Enter your password'
          required
          value={userData.password}
          onChange={updateUserData('password')}
        />
        <input
          name='confirmPassword'
          type='password'
          placeholder='Re-enter your password'
          required
          value={userData.confirmPassword}
          onChange={updateUserData('confirmPassword')}
        />
        <button
          type='submit'
          disabled={mutation.isLoading || mutation.isSuccess}
        >
          Create Account
        </button>
      </form>
      <p>{mutation.isError ? (mutation.error as Error).message : null}</p>
    </>
  )
}
