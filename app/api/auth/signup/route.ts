import bcrypt from 'bcrypt'
import prisma from '@/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request): Promise<NextResponse<SignUpAPIResponse>> {
  const { name, email, password } = await req.json()

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      },
      select: {
        email: true
      }
    })

    if (existingUser) throw new Error(`${email} has already been used.`)

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
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 400 })
  }
}