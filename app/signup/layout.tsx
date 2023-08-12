import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Loading from '../loading'

export const metadata: Metadata = {
  title: 'Sign Up | Milestones',
}

const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Suspense fallback={<Loading/>}>{children}</Suspense>
    </section>
  )
}

export default SignUpLayout
