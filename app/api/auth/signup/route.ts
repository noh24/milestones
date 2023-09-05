import bcrypt from 'bcrypt'
import prisma from '@/db'
import { NextResponse } from 'next/server'
import Helper from '@/lib/helper'

export async function POST(req: Request): Promise<NextResponse<SignUpApiResponse>> {
  const { name, email, password, confirmPassword } = await req.json()

  try {
    if (password !== confirmPassword) throw new Error('Passwords must match!')

    const existingUser = await prisma.user.findFirst({
      where: {
        email
      },
      select: {
        email: true
      }
    })

    if (existingUser) throw new Error(`Email provided is already in use: ${email}`)

    const hashedPassword = bcrypt.hashSync(password, 10)
    await prisma.user.create({
      data: {
        name: name!,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ success: true, data: 'Successfully registered user.', error: null }, { status: 200 })
  } catch (err) {
    console.error('Sign Up Route: ', err)
    return NextResponse.json({ success: false, data: null, error: Helper.sanitizeErrorMessage(String(err)) }, { status: 400 })
  }
}