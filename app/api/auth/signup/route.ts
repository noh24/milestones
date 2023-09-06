import bcrypt from 'bcrypt'
import prisma from '@/prisma/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json()

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

    return NextResponse.json({ success: true, data: 'User has been successfully registered!', error: null }, { status: 200 })
  } catch (err) {
    console.error('Sign Up Route: ', err)
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}