import { createRouter } from '../createRouter'
import { postRouter } from './post.router'
import { userRouter } from './user.router'

export const appRouter = createRouter()
.merge('user.', userRouter)
.merge('post.', postRouter)

export type AppRouter = typeof appRouter
