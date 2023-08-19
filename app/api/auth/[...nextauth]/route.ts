import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/db'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          })
        })

        const data = await response.json()

        if (data.response) {
          return data.response
        } else {
          throw new Error(data.message)
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }