import { createRouter } from '../createRouter'
import { GetProfileSchema, UserSignupSchema } from '../schemas/user.schema'
import * as trpc from '@trpc/server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { cloudinary } from '../../services/cloudinary'

export const userRouter = createRouter()
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
                likedUsers: { select: { id: true, name: true, avatar: true } },
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
  .mutation('set-avatar', {
    input: z.object({ image: z.any() }),

    resolve: async ({ ctx, input }) => {
      const { image } = input

      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be logged in to create a post',
        })
      }

      const path = await cloudinary.uploader.upload(image, { upload_preset: 'react-upload' })
      const url = path.secure_url

      const uploadAvatar = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          avatar: url,
        },
      })

      if (!uploadAvatar) return null

      return { status: 'ok' }
    },
  })
