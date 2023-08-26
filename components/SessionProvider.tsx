'use client'

import { SessionProvider as Provider } from 'next-auth/react'
import { ReactNode, FC } from 'react'
import { Session } from 'next-auth'

type TProps = {
  children: ReactNode
  session: Session
}

const SessionProvider: FC<TProps> = ({ children, session }) => {
  return <Provider session={session}>{children}</Provider>
}

export default SessionProvider
