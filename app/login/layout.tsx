import { Metadata } from 'next'
import React, { Suspense } from 'react'
import Loading from './loading'

export const metadata: Metadata = {
  title: 'Login | Milestones',
}

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </section>
  )
}

export default LoginLayout
