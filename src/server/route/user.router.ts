import { createRouter } from '../createRouter'
import { UserSignupSchema } from '../schemas/user.schema'
import * as trpc from '@trpc/server'
import bcrypt from 'bcrypt'

export const userRouter = createRouter().mutation('signup', {
  input: UserSignupSchema,

  async resolve({ ctx, input }) {
    const { email, name, password } = input

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    })

    if (exists) {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: 'User already exists',
      })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = await ctx.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return {
      status: 201,
      message: 'Account created.',
      result: newUser.email,
    }
  },
})
