import './globals.css'
import React, { FC, ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from './components/Provider'
import { Session } from 'next-auth'
import HeaderNavBar from './components/HeaderNavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Home | Milestones',
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
        <Provider session={session}>
          <header>
            <HeaderNavBar />
          </header>
          {children}
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout
