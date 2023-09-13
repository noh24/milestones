'use client'

import { SessionProvider as Provider } from 'next-auth/react'
import { ReactNode } from 'react'
import { Session } from 'next-auth'

type TProps = {
  children: ReactNode
  session: Session
}

const SessionProvider = ({ children, session }: TProps) => {
  return <Provider session={session}>{children}</Provider>
}

export default SessionProvider
