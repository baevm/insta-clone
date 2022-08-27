import * as trpc from '@trpc/server'
import { z } from 'zod'
import { cloudinary } from '../../services/cloudinary'
import { createRouter } from '../createRouter'
import {
  AddCommentSchema,
  DeleteCommentSchema,
  DeletePostSchema,
  GetPostSchema,
  LikePostSchema,
  PostSchema,
} from '../schemas/post.schema'

export const postRouter = createRouter()
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

      /*   const feed = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user.id,
        },
        select: {
          email: true,
          name: true,
          avatar: true,
          posts: {
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
          },

          following: {
            select: {
              posts: {
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
              },
            },
          },
        },
      }) */

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

      const followingUsersIds = followingUsers?.following.map((user) => user.id)
      const followingIdsWithMe = followingUsersIds ? [...followingUsersIds, ctx.session.user.id] : [ctx.session.user.id]

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

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop()
        console.log(nextItem)
        nextCursor = nextItem!.id;
      }

      return {
        feed: JSON.parse(JSON.stringify(posts)) as typeof posts,
        nextCursor
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
  .query('get-post', {
    input: GetPostSchema,
    resolve: async ({ ctx, input }) => {
      const { postId } = input

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },

        include: {
          likedUsers: true,
          User: {
            select: {
              name: true,
              avatar: true,
              id: true,
            },
          },
          comments: {
            include: {
              User: true,
            },
          },
        },
      })

      if (!post) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        })
      }

      return { post: JSON.parse(JSON.stringify(post)) }
    },
  })
  .mutation('create-post', {
    input: PostSchema,

    resolve: async ({ ctx, input }) => {
      const { caption, images } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to create a post',
        })
      }

      let urls = []

      // upload files to cloudindary and get their urls
      for (const file of images) {
        const path = await cloudinary.uploader.upload(file, { upload_preset: 'react-upload' })
        urls.push(path.secure_url)
      }

      // create post in a db with urls of files
      const post = await ctx.prisma.post.create({
        data: {
          images: urls,
          userId: ctx.session?.user.id,
        },
      })

      // if caption exists, create comment with it
      if (caption) {
        await ctx.prisma.comments.create({
          data: {
            postId: post.id,
            userId: ctx.session.user.id,
            body: caption!,
          },
        })
      }

      if (!post) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }

      return {
        status: 'ok',
      }
    },
  })
  .mutation('delete-post', {
    input: DeletePostSchema,

    resolve: async ({ ctx, input }) => {
      const { id } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to create a post',
        })
      }

      const delPost = ctx.prisma.post.delete({
        where: {
          id,
        },
      })

      console.log(delPost)

      const delCommentsFromPost = ctx.prisma.comments.deleteMany({
        where: {
          postId: id,
        },
      })

      const transaction = await ctx.prisma.$transaction([delCommentsFromPost, delPost])

      // del image from cloudinary after deleting post

      return {
        status: 'ok',
      }
    },
  })
  .mutation('like-post', {
    input: LikePostSchema,

    resolve: async ({ ctx, input }) => {
      const { postId } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in.',
        })
      }

      const liked = await ctx.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedUsers: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
    },
  })
  .mutation('unlike-post', {
    input: LikePostSchema,

    resolve: async ({ ctx, input }) => {
      const { postId } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in.',
        })
      }

      const unliked = await ctx.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedUsers: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
    },
  })
  .mutation('add-comment', {
    input: AddCommentSchema,

    resolve: async ({ ctx, input }) => {
      const { postId, comment } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to comment.',
        })
      }

      const commentAdded = await ctx.prisma.comments.create({
        data: {
          postId,
          userId: ctx.session.user.id,
          body: comment,
        },
      })

      return {
        status: 'ok',
      }
    },
  })
  .mutation('delete-comment', {
    input: DeleteCommentSchema,

    resolve: async ({ ctx, input }) => {
      const { commentId } = input

      if (!commentId) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
        })
      }

      const commentDeleted = await ctx.prisma.comments.delete({
        where: {
          id: commentId,
        },
      })

      return { status: 'ok' }
    },
  })
