import './globals.css'
import React, { ReactNode, Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionProvider from './_providers/SessionProvider'
import { Session } from 'next-auth'
import HeaderNavBar from './_components/HeaderNavBar'
import QueryClientProvider from './_providers/QueryClientProvider'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Home - Milestones',
  description: 'Generated by create next app',
}

type TProps = {
  children: ReactNode
  session: Session
}

const RootLayout = ({ children, session }: TProps) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <QueryClientProvider>
          <SessionProvider session={session}>
            <HeaderNavBar />
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
