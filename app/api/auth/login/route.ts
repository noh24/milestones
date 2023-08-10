import { NextApiResponse, NextApiRequest } from 'next/types'
import prisma from '@/app/db'
import bcrypt from 'bcrypt'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
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

    res.status(200).json({ message: 'Login successful.' })
  } catch (error) {
    console.error(error)
  }
}
