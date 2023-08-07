'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, FC } from 'react'

type TProps = {
  children: ReactNode
}
const Provider: FC<TProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Provider
