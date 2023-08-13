import bcrypt from 'bcrypt'
import prisma from '@/app/db'

type SignUpPostRequest = {
  body: {
    name: string
    email: string
    password: string
  }
}

export async function POST(req: SignUpPostRequest): Promise<{ message?: string, error?: string }> {
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

    return { message: 'User registered successfully' }
  } catch (error) {
    console.error('Error occured: ', error)
    return { error: `${error}` }
  }
}
