import { createSSGHelpers } from '@trpc/react/ssg'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'
import superjson from 'superjson'
import Profile from '../../components/Profile/Profile'
import { createContext } from '../../server/createContext'
import { appRouter } from '../../server/router/app.router'
import { trpc } from '../../utils/trpc'

const FourOFourWarning = dynamic(() => import('../../components/FourOFourWarning'), { ssr: false })

type Props = {
  slug: string
}

const ProfilePage = ({ slug }: Props) => {
  const { data } = trpc.useQuery(['user.get-profile', { slug }], {
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })

  if (!data) {
    return <FourOFourWarning />
  }

  return <Profile profile={data!.profile} />
}

export default ProfilePage

export const getServerSideProps = async (context: GetServerSidePropsContext<{ profile: string }>) => {
  const slug = context.params?.profile

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(context as any),
    transformer: superjson,
  })

  try {
    await ssg.fetchQuery('user.get-profile', { slug })
  } catch (error) {
    console.error(error)
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  }
}
