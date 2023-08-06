import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/db'
import bcrypt from 'bcrypt'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'johnsmith@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<"email" | "password", string>) {

        const { email, password } = credentials

        const user = await fetch('api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        })

        user ? user : null


        // try {
        //   const user = await prisma.user.findFirst({
        //     where: {
        //       email,
        //     }
        //   })

        //   if (!user) throw new Error('No user found.')

        //   const validPassword = bcrypt.compareSync(password, user.password!)
        //   if (!validPassword) throw new Error('Invalid password.')

        //   return user
        // } catch (error) {
        //   console.error('Error occured: ', error)
        //   return null
        // }
      },
    })
  ]
})