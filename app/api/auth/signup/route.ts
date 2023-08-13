import bcrypt from 'bcrypt'
import prisma from '@/app/db'
import { NextResponse } from 'next/server'

type SignUpPostRequest = {
  body: {
    name: string
    email: string
    password: string
  }
}

export async function POST(req: SignUpPostRequest) {
  const { name, email, password } = req.body

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
        name,
        email,
        password: hashedPassword
      }
    })

    NextResponse.json({ message: 'User registered successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error occured: ', error)
    NextResponse.json({ error: `${error}` }, { status: 400 })
  }
}
