import prisma from '@/db'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (!user) { throw new Error('Invalid email!') }

    const validPassword = bcrypt.compareSync(password, user.password!)

    if (!validPassword) { throw new Error('Invalid password!') }

    return NextResponse.json({ response: user, message: 'Sign in was successful' }, { status: 200 })
  } catch (error) {
    console.error('Sign In Route', error)
    return NextResponse.json({ response: null, message: `${error}` }, { status: 400 })
  }
}
