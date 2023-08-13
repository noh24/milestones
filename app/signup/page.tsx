'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const SignUp = () => {
  const router = useRouter()

  const { data: session } = useSession()
  if (session) {
    router.push('/')
  }

  


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
