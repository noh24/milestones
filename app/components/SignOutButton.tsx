'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

const SignOutButton: FC = () => {
  const { data: session } = useSession()
  const router = useRouter()

  return session ? (
    <button onClick={() => signOut()}>Sign Out</button>
  ) : (
    <button onClick={() => router.push('/signin')}>Sign In</button>
  )
}

export default SignOutButton
