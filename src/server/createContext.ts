import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { nextAuthOptions } from '../pages/api/auth/[...nextauth]'
import prisma from '../utils/prisma'
import * as trpc from "@trpc/server";

export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  return { req, res, prisma, session }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
