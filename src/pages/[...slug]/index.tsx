import { Anchor, Box, Center, Text, Title } from '@mantine/core'
import Link from 'next/link'
import Profile from '../../components/Profile/Profile'
import { ProfileProps } from '../../types/profile.type'
import prisma from '../../utils/prisma'

type Props = {
  data: { error?: boolean; profile: ProfileProps }
}

const ProfilePage = ({ data }: Props) => {
  if (data.error) {
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

  return (
    <>
      <Profile profile={data.profile} />
    </>
  )
}

export default ProfilePage

export const getServerSideProps = async (ctx: any) => {
  const slug = ctx.params.slug
  let data

  if (slug.length === 1) {
    data = await prisma.user.findUnique({
      where: {
        name: slug[0],
      },

      select: {
        name: true,
        avatar: true,
        email: true,
        id: true,
        posts: true,
        followedBy: true,
        following: true,
        description: true,
      },
    })
  }

  /* if (slug.length === 2 && slug.includes('tagged')) {
    data = { username: 'username', id: 1, tagged: true }
  } */

  if (!data) {
    return {
      props: {
        data: { error: true },
      },
    }
  }

  return {
    props: {
      data: { profile: JSON.parse(JSON.stringify(data)) },
    },
  }
}
