import * as trpc from '@trpc/server'
import { cloudinary } from '../../services/cloudinary'
import { createRouter } from '../createRouter'
import { DeletePostSchema, PostSchema } from '../schemas/post.schema'

export const postRouter = createRouter()
  .mutation('create-post', {
    input: PostSchema,

    resolve: async ({ ctx, input }) => {
      const { caption, image } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to create a post',
        })
      }

      const data = await cloudinary.uploader.upload(image, { upload_preset: 'react-upload' })

      const imageUrl = data.secure_url

      const post = await ctx.prisma.post.create({
        data: {
          caption,
          image: imageUrl,
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
        result: { image: post?.image, caption: post?.caption },
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
