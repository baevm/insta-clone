import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { UserLoginSchema } from '../../../server/schemas/user.schema'
import prisma from '../../../utils/prisma'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30days
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async (credentials, request) => {
        const creds = await UserLoginSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: {
            email: creds.email,
          },
        })

        if (!user) {
          throw new Error("User with this email doesn't exist")
        }

        if (user && bcrypt.compareSync(creds.password, user.password!)) {
          return user
        } else {
          return null
        }
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user)

      return token
    },

    session: async ({ session, token }) => {
      session.user = {
        id: token.user.id,
        name: token.user.name,
        email: token.user.email,
        emailVerified: token.user.emailVerified,
        avatar: token.user.avatar,
        updatedAt: token.user.updatedAt,
        createdAt: token.user.createdAt,
      }
      return session
    },
  },
}

export default NextAuth(nextAuthOptions)
