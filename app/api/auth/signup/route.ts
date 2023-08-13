import bcrypt from 'bcrypt'
import prisma from '@/app/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email
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

    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error occured: ', error)
    return NextResponse.json({ message: `${error}` }, { status: 400 })
  }
}
