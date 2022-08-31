import * as trpc from '@trpc/server'
import { createRouter } from '../createRouter'
import { z } from 'zod'

export const feedRouter = createRouter()
  .query('get-feed', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to access this resource',
        })
      }

      const limit = input.limit ?? 5
      const { cursor } = input

      // get following from the current user
      const followingUsers = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          following: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })

      // get ids of following response
      const followingUsersIds = followingUsers?.following.map((user) => user.id)

      // add current user to arr with following users is
      const followingIdsWithMe = followingUsersIds ? [...followingUsersIds, ctx.session.user.id] : [ctx.session.user.id]

      // get posts from following users including current user
      const posts = await ctx.prisma.post.findMany({
        where: {
          User: {
            id: {
              in: followingIdsWithMe,
            },
          },
        },
        select: {
          id: true,
          likedUsers: true,
          images: true,
          createdAt: true,
          comments: { select: { body: true, createdAt: true, id: true, User: { select: { name: true } } } },
          User: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      })

      let nextCursor: typeof cursor | undefined = undefined

      // get next post cursor if there are more posts
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem!.id
      }

      return {
        feed: JSON.parse(JSON.stringify(posts)) as typeof posts,
        nextCursor,
      }
    },
  })
  .query('get-suggestions', {
    resolve: async ({ ctx }) => {
      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to create a post',
        })
      }

      const suggestions = await ctx.prisma.user.findMany({
        where: {
          AND: [{ NOT: { id: ctx.session?.user.id } }, { NOT: { followedBy: { some: { id: ctx.session?.user.id } } } }],
        },
        select: {
          id: true,
          name: true,
          followedBy: true,
          avatar: true,
        },
        take: 4,
      })
      return {
        suggestions: JSON.parse(JSON.stringify(suggestions)) as typeof suggestions,
      }
    },
  })
  .mutation('search-user', {
    input: z.object({
      query: z.string().nonempty(),
    }),

    resolve: async ({ ctx, input }) => {
      const { query } = input

      const searchResult = await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
        take: 10,
      })

      if (searchResult.length === 0) {
        return { searchResult, message: 'No users found', status: 404 }
      } else {
        return { searchResult, message: 'ok', status: 201 }
      }
    },
  })
