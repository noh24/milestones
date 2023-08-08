import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Home() {
  await getSession()

  return (
    <>
      <Link href='/about'>About</Link>
      <div className='text-5xl'>Home Page</div>
    </>
  )
}

async function getSession() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }
}
