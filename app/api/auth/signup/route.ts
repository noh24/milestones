import bcrypt from 'bcrypt'
import prisma from '@/app/db'
import { NextResponse } from 'next/server'

export async function POST(req: ExtendedRequest) {
  const { name, email, password } = JSON.parse(req.body)
  console.log(name)
  console.log(email)
  console.log(password)

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

    NextResponse.json({ message: 'User registered successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error occured: ', error)
    NextResponse.json({ message: `${error}` }, { status: 400 })
  }
}
