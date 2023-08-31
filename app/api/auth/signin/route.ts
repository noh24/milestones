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

    return NextResponse.json({ success: true, data: user, error: null }, { status: 200 })
  } catch (err) {
    console.error('Sign In Route', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}
