'use client'

import React from 'react'
import { useSession } from 'next-auth/react'

const SignUp = () => {
  const { data: session } = useSession()
  if (session) {
    
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
    </>
  )
}

export default SignUp
