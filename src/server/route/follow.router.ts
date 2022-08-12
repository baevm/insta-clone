import * as trpc from '@trpc/server'
import { createRouter } from '../createRouter'
import { FollowSchema } from '../schemas/follow.schema'

export const followRouter = createRouter()
  .mutation('follow', {
    input: FollowSchema,

    async resolve({ ctx, input }) {
      const { userId } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to follow user',
        })
      }

      try {
        const following = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            following: {
              connect: {
                id: userId,
              },
            },
          },
        })

        const followedBy = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            followedBy: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        })
      } catch (error) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }

      return {
        status: 201,
        message: 'User followed',
      }
    },
  })

  .mutation('unfollow', {
    input: FollowSchema,

    async resolve({ ctx, input }) {},
  })
