'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, FC } from 'react'
import { Session } from 'next-auth'

type TProps = {
  children: ReactNode
  session: Session
}
const Provider: FC<TProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Provider
