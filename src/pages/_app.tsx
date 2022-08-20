import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { withTRPC } from '@trpc/next'
import { AppRouter } from '../server/route/app.router'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { url } from '../constants/url.const'
import superjson from 'superjson'
import { SessionProvider } from 'next-auth/react'
import Layout from '../components/Layout'
import type { NextComponentType } from 'next'
import Head from 'next/head'

type CustomAppProps = AppProps & {
  Component: NextComponentType & { noHeader?: boolean }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <SessionProvider session={session}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          {Component.noHeader ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </MantineProvider>
      </SessionProvider>
    </>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [loggerLink(), httpBatchLink({ maxBatchSize: 10, url })]

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            /* refetchOnWindowFocus: false, */
            /* refetchOnReconnect: false, */
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

// TODO:
// 200% in windows settings breaks whole profile layout
// add likes to posts
// add searching
// check profiles without logging in,
// fix second modal closes first modal in post
// delete post in profile page
// delete comment
// following and followers modal on profile
// animations
