import { createRouter } from '../createRouter'
import { GetProfileSchema, UserSignupSchema } from '../schemas/user.schema'
import * as trpc from '@trpc/server'
import bcrypt from 'bcrypt'

export const userRouter = createRouter()
  .mutation('signup', {
    input: UserSignupSchema,

    async resolve({ ctx, input }) {
      const { email, name, password } = input

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      })

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: `User with email ${email} already exists`,
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
  .query('get-profile', {
    input: GetProfileSchema,
    async resolve({ ctx, input }) {
      const { slug } = input
      let data

      /* if (slug.length > 1) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'Link is invalid',
        })
      } */

      if (slug) {
        data = await ctx.prisma.user.findUnique({
          where: {
            name: slug,
          },

          select: {
            name: true,
            avatar: true,
            email: true,
            id: true,
            posts: {
              include: {
                comments: {
                  select: {
                    body: true,
                    createdAt: true,
                    id: true,
                    User: { select: { name: true, id: true, avatar: true } },
                  },
                },
              },
            },
            followedBy: { select: { avatar: true, createdAt: true, description: true, id: true, name: true } },
            following: { select: { avatar: true, createdAt: true, description: true, id: true, name: true } },
            description: true,
          },
        })
      }

      if (!data) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        })
      }

      return {
        profile: JSON.parse(JSON.stringify(data)),
      }
    },
  })
