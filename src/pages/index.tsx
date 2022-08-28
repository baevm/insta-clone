import { createSSGHelpers } from '@trpc/react/ssg'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import superjson from 'superjson'
import Feed from '../components/Feed/Feed'
import { createContext } from '../server/createContext'
import { appRouter } from '../server/router/app.router'

const Home: NextPage = () => {
  return <Feed />
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(context as any),
    transformer: superjson,
  })

  await ssg.fetchInfiniteQuery('feed.get-feed', { limit: 5 })
  await ssg.fetchQuery('feed.get-suggestions')

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}
