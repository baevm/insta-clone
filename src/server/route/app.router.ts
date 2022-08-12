import { createRouter } from '../createRouter'
import { followRouter } from './follow.router'
import { postRouter } from './post.router'
import { userRouter } from './user.router'

export const appRouter = createRouter()
.merge('user.', userRouter)
.merge('post.', postRouter)
.merge('follow.', followRouter)

export type AppRouter = typeof appRouter
