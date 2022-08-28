import { createRouter } from '../createRouter'
import { feedRouter } from './feed.router'
import { followRouter } from './follow.router'
import { postRouter } from './post.router'
import { userRouter } from './user.router'

export const appRouter = createRouter()
  .merge('user.', userRouter)
  .merge('post.', postRouter)
  .merge('follow.', followRouter)
  .merge('feed.', feedRouter)

export type AppRouter = typeof appRouter
