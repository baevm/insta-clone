import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { withTRPC } from '@trpc/next'
import { AppRouter } from '../server/route/app.router'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { url } from '../constants/url.const'
import superjson from 'superjson'
import { SessionProvider } from "next-auth/react"; 

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  
  return (
    <SessionProvider session={session}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [loggerLink(), httpBatchLink({ maxBatchSize: 10, url })]

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return { ...ctx.req.headers, 'x-ssr': '1' }
        }

        return {}
      },
      links,
      transformer: superjson,
    }
  },
  ssr: false,
})(MyApp)
