import { createSSGHelpers } from '@trpc/react/ssg'
import { GetServerSidePropsContext } from 'next'
import superjson from 'superjson'
import Post from '../../components/Profile/Post/Post'
import { createContext } from '../../server/createContext'
import { appRouter } from '../../server/router/app.router'

type Props = {
  postId: string
}

const PhotoPage = ({ postId }: Props) => {
  return <Post postId={postId} type='standalone' />
}

export default PhotoPage

export const getServerSideProps = async (context: GetServerSidePropsContext<{ photo: string }>) => {
  const postId = context.params?.photo as string

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(context as any),
    transformer: superjson,
  })

  try {
    await ssg.fetchQuery('post.get-post', { postId })
  } catch (error) {
    return {
      // not found true shows 404 page without changing url for /404
      notFound: true,
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  }
}
