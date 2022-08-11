import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      emailVerified: boolean
      avatar: string
      createdAt: string
      updatedAt: string
    }
  }

  interface User {
    email: string
    name: string
    emailVerified: boolean
    password: string
    createdAt: string
    updatedAt: string
    avatar: string
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    email: string
    picture: string
    sub: string
    user: {
      id: string
      name: string
      email: string
      emailVerified: boolean
      password: string
      avatar: string
      createdAt: string
      updatedAt: string
    }
    iat: number
    exp: number
    jti: string
  }
}
