import * as trpc from '@trpc/server'
import { cloudinary } from '../../services/cloudinary'
import { createRouter } from '../createRouter'
import { AddCommentSchema, DeletePostSchema, LikePostSchema, PostSchema } from '../schemas/post.schema'

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
              caption: true,
              likes: true,
              likedUsers: true,
              images: true,
              createdAt: true,
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
                  caption: true,
                  likes: true,
                  likedUsers: true,
                  images: true,
                  createdAt: true,
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

      for (const file of images) {
        const path = await cloudinary.uploader.upload(file, { upload_preset: 'react-upload' })
        urls.push(path.secure_url)
      }

      /*  const data = await cloudinary.uploader.upload(image, { upload_preset: 'react-upload' }) */

      /* const imageUrl = data.secure_url */

      const post = await ctx.prisma.post.create({
        data: {
          caption,
          images: urls,
          userId: ctx.session?.user.id,
        },
      })

      if (!post) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }

      return {
        status: 201,
        message: 'Post created.',
        result: { image: post?.images, caption: post?.caption },
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

      const delPost = await ctx.prisma.post.delete({
        where: {
          id,
        },
      })

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

/*   .mutation('delete-comment', {
    input: DeleteCommentSchema,
  }) */
