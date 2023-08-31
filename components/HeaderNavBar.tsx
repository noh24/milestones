import Link from 'next/link'
import React, { FC } from 'react'
import SignOutButton from './SignOutButton'
import Image from 'next/image'

const HeaderNavBar: FC = () => {
  return (
    <header>
      <nav>
        <Link href='/'>
          <Image
            src='/milestones-logo.png'
            alt='milestones logo'
            width={50}
            height={50}
          ></Image>{' '}
          Milestones
        </Link>
        <ul>
          <li>
            <Link href='/get-started'>Get Started</Link>
          </li>
          <li>
            <Link href='/milestones'>Milestones</Link>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default HeaderNavBar
