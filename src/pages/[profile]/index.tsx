import { createSSGHelpers } from '@trpc/react/ssg'
import { GetServerSidePropsContext } from 'next'
import superjson from 'superjson'
import Profile from '../../components/Profile/Profile'
import SEO from '../../components/SEO'
import { createContext } from '../../server/createContext'
import { appRouter } from '../../server/router/app.router'
import { trpc } from '../../utils/trpc'

type Props = {
  slug: string
}

const ProfilePage = ({ slug }: Props) => {
  const { data } = trpc.useQuery(['user.get-profile', { slug }], {
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })


  return (
    <>
      <SEO title={`@${data?.profile.name}`} siteName='Instagram photos and videos' />
      <Profile profile={data!.profile} />
    </>
  )
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
    return {
      // notFound true shows 404 page without changing url for /404
      notFound: true,
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  }
}
