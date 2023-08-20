import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'

export default async function Home() {
  const session = await getSession()

  return session ? (
    <>
      <Link href='/milestone'>Add Milestones</Link>
    </>
  ) : (
    <>
      <p>
        Milestones is an app to help combat imposter syndome by storing and
        tracking all your wins. We are here to remind you that you&apos;re
        making progress by regularly updating you about your achievements. No
        matter how small or big, we believe in celebrating all our wins.
      </p>
    <Link href='/get-started'>Get Started</Link>\
    <p>WIP Notes: Put screenshots of Milestones being used</p>
    <p>Examples: Screenshots of milestones and the reminder feature</p>
    </>
  )
}

async function getSession() {
  const session = await getServerSession(authOptions)

  return session
}
