import prisma from '@/app/db'
import bcrypt from 'bcrypt'

type LoginPostRequest = {
  body: {
    email: string
    password: string
  }
}

export async function POST(req: LoginPostRequest): Promise<User | null> {
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

    return user
  } catch (error) {
    console.error('Error: ', error)
    return null
  }
}
