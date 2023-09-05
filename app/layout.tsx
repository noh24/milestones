import './globals.css'
import React, { FC, ReactNode, Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/SessionProvider'
import { Session } from 'next-auth'
import HeaderNavBar from '../components/HeaderNavBar'
import QueryClientProvider from '@/components/QueryClientProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
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

const RootLayout: FC<TProps> = ({ children, session }) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <QueryClientProvider>
          <SessionProvider session={session}>
            <HeaderNavBar />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
