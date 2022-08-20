import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Feed from '../components/Feed/Feed'
import prisma from '../utils/prisma'
import { nextAuthOptions } from './api/auth/[...nextauth]'
import { createSSGHelpers } from '@trpc/react/ssg'
import { appRouter } from '../server/route/app.router'
import { createContext } from '../server/createContext'
import superjson from 'superjson'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const { data: feed } = trpc.useQuery(['post.get-feed'])
  const { data: suggestions } = trpc.useQuery(['post.get-suggestions'])

  return <Feed feed={feed?.feed} suggestions={suggestions?.suggestions} />
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson,
  })

  await ssg.fetchQuery('post.get-feed')
  await ssg.fetchQuery('post.get-suggestions')

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}
