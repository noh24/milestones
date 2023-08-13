import prisma from '@/app/db'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(req: ExtendedRequest) {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (!user) throw new Error('Invalid email!')

    const validPassword = bcrypt.compareSync(password, user.password!)

    if (!validPassword) throw new Error('Invalid password!')

    NextResponse.json({ response: user }, { status: 200 })
  } catch (error) {
    console.error('Error: ', error)
    NextResponse.json({ response: null, error: error }, { status: 400 })
  }
}
