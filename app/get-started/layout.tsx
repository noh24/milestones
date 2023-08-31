import { Metadata } from 'next'
import React, { Suspense } from 'react'
import Loading from '@/app/loading'

export const metadata: Metadata = {
  title: 'Getting Started - Milestones',
}

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </section>
  )
}

export default SignInLayout
