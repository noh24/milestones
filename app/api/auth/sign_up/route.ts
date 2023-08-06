import bcrypt from 'bcrypt'
import prisma from '@/db'
import { NextApiResponse, NextApiRequest } from 'next/types'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
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

    res.status(200).json({ message: 'User registered successfully.' })
  } catch (error) {
    console.error('Error occured: ', error)
  }
}
