'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    setLocalState({
      loading: false,
      success: false,
      error: userData.password !== userData.confirmPassword,
      message: 'Passwords must match!',
    })
  }, [userData.password, userData.confirmPassword])

  const formHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalState({
      loading: true,
      success: false,
      error: false,
      message: '',
    })

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data: SignUpAPIResponse = await res.json()
      if (!res.ok) throw new Error(data.error!)

      setLocalState({
        loading: false,
        success: true,
        error: false,
        message: data.data!,
      })

      setTimeout(() => router.push('/signin'), 3000)
    } catch (err) {
      setLocalState({
        loading: false,
        success: false,
        error: true,
        message: String(err),
      })
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
        <button
          type='submit'
          disabled={localState.loading || localState.success}
        >
          Create account
        </button>
      </form>
      <p>
        {localState.message && localState.success ? localState.message : null}
        {localState.message && localState.error ? localState.message : null}
      </p>
    </>
  )
}

export default SignUp
