import { Anchor, Center, Text, Title } from '@mantine/core'
import { createSSGHelpers } from '@trpc/react/ssg'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import superjson from 'superjson'
import Profile from '../../components/Profile/Profile'
import { createContext } from '../../server/createContext'
import { appRouter } from '../../server/route/app.router'
import { trpc } from '../../utils/trpc'

type Props = {
  slug: any
}

const ProfilePage = ({ slug }: Props) => {
  const { data } = trpc.useQuery(['user.get-profile', { slug }], {
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })

  if (!data) {
    return (
      <Center sx={{ flexDirection: 'column' }} py='4rem'>
        <Title order={3}>Sorry this page isn&apos;t avaliable</Title>
        <Text>
          The link you followed may be broken, or the page may have been removed.{' '}
          <Link href='/' passHref>
            <Anchor>Go back to Instagram.</Anchor>
          </Link>
        </Text>
      </Center>
    )
  }

  return <Profile profile={data!.profile} />
}

export default ProfilePage

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const slug = context.params?.profile

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(context),
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
