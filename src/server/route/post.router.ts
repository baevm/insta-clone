import * as trpc from '@trpc/server'
import { cloudinary } from '../../services/cloudinary'
import { createRouter } from '../createRouter'
import {
  AddCommentSchema,
  DeleteCommentSchema,
  DeletePostSchema,
  LikePostSchema,
  PostSchema,
} from '../schemas/post.schema'

export const postRouter = createRouter()
  .query('get-feed', {
    resolve: async ({ ctx }) => {
      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to access this resource',
        })
      }

      const feed = await ctx.prisma.user.findUnique({
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
      })

      return {
        feed: JSON.parse(JSON.stringify(feed)) as typeof feed,
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
        status: 201,
        message: 'Post created.',
        /*  result: { image: post?.images, caption: post?.caption }, */
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

      const delCommentsFromPost = ctx.prisma.comments.deleteMany({
        where: {
          postId: id,
        },
      })

      const transaction = await ctx.prisma.$transaction([delCommentsFromPost, delPost])

      

      // del image from cloudinary after deleting post

      return {
        status: 200,
        message: 'Post deleted.',
      }
    },
  })
  .mutation('like-post', {
    input: LikePostSchema,

    resolve: async ({ ctx, input }) => {
      const { postId } = input
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
        status: 200,
        message: 'Comment added.',
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

      return { status: 201, message: 'Comment deleted.' }
    },
  })
