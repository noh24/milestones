'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

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

  const mutation = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      const data: SignUpAPIResponse = await res.json()
      if (!res.ok) throw new Error(data.error!)
      setTimeout(() => router.push('/signin'), 3000)
      return data
    },
  })

  useEffect(() => console.log(mutation), [mutation])

  return (
    <>
      <form onSubmit={mutation.mutate}>
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
        <button
          type='submit'
          disabled={mutation.isLoading || mutation.isSuccess}
        >
          Create Account
        </button>
      </form>
      <p>
        {mutation.isSuccess ? mutation.data.data : null}
        {mutation.isError ? (mutation.error as Error).message : null}
      </p>
    </>
  )
}

export default SignUp
