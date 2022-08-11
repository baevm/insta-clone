import { createRouter } from '../createRouter'
import { UserSignupSchema } from '../schemas/user.schema'
import * as trpc from '@trpc/server'
import bcrypt from 'bcrypt'

export const followRouter = createRouter()
.mutation('follow', {
  input: UserSignupSchema,

  async resolve({ ctx, input }) {},
})
.mutation('unfollow', {
    input: UserSignupSchema,
  
    async resolve({ ctx, input }) {},
  })
