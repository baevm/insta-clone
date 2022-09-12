import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { unstable_getServerSession } from 'next-auth'
import { nextAuthOptions } from '../pages/api/auth/[...nextauth]'
import prisma from '../utils/prisma'

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const req = opts?.req
  const res = opts?.res

  const session = req && res && await unstable_getServerSession(req, res, nextAuthOptions)
  return { req, res, prisma, session }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
