import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Feed from '../components/Feed/Feed'
import prisma from '../utils/prisma'
import { nextAuthOptions } from './api/auth/[...nextauth]'

const Home: NextPage = ({ feed, suggestions }: any) => {
  return (
    <>
      <Feed feed={feed} suggestions={suggestions} />
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  let suggestions
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)

  // get posts for feed
  try {
    data = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        following: {
          select: {
            posts: {
              select: {
                id: true,
                caption: true,
                likes: true,
                likedUsers: true,
                image: true,
                createdAt: true,
                User: {
                  select: { id: true, name: true, avatar: true },
                },
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error(error)
  }

  //TODO: filter user suggestions where the session user is not following and limit to 5 random
  try {
    suggestions = await prisma.user.findMany({
      where: {
        OR: [
          {
            NOT: { id: session?.user.id },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        followedBy: true,
        avatar: true,
      },
      take: 4,
    })
  } catch (error) {
    console.error(error)
  }

  return {
    props: {
      feed: JSON.parse(JSON.stringify(data)),
      suggestions: JSON.parse(JSON.stringify(suggestions)),
    },
  }
}
