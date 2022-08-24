import { createSSGHelpers } from '@trpc/react/ssg'
import { GetServerSidePropsContext } from 'next'
import { useState } from 'react'
import superjson from 'superjson'
import FourOFourWarning from '../../components/FourOFourWarning'
import Post from '../../components/Profile/Post/Post'
import { createContext } from '../../server/createContext'
import { appRouter } from '../../server/router/app.router'
import { trpc } from '../../utils/trpc'

type Props = {
  postId: string
}

const PhotoPage = ({ postId }: Props) => {
  const { data } = trpc.useQuery(['post.get-post', { postId }], {
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
  const [isToastVisible, setIsToastVisible] = useState(false)

  if (!data) {
    return <FourOFourWarning />
  }

  return (
    <Post
      avatar={data!.post.User.avatar}
      post={data!.post}
      name={data!.post.User.name}
      type='standalone'
      setIsToastVisible={setIsToastVisible}
    />
  )
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
    console.error(error)
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  }
}
