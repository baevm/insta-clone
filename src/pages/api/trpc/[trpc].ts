import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/router/app.router'
import { createContext } from '../../../server/createContext'
import { withCors } from '../../../middleware'

export default withCors(
  trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,

    responseMeta(ctx) {
      ctx.ctx?.res?.setHeader('Access-Control-Allow-Origin', '.brand.localhost')
      ctx.ctx?.res?.setHeader('Access-Control-Request-Method', '*')
      ctx.ctx?.res?.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
      ctx.ctx?.res?.setHeader('Access-Control-Allow-Headers', '*')

      if (ctx.ctx?.req?.method === 'OPTIONS') {
        ctx.ctx?.res?.writeHead(200)
      }

      return {
        headers: ctx.ctx?.res?.getHeaders() as Record<string, string>,
        statusCode: ctx.ctx?.res?.statusCode || 200,
      }
    },

    onError({ error }) {
      console.error(error)
    },
  })
)
