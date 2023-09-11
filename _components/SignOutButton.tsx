'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const SignOutButton = () => {
  const { data: session } = useSession()
  const router = useRouter()

  return session ? (
    <button
      onClick={() =>
        signOut({
          callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/signin`,
        })
      }
    >
      Sign Out
    </button>
  ) : (
    <button onClick={() => router.push('/signin')}>Sign In</button>
  )
}

export default SignOutButton
