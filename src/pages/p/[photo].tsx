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
  const [isToastVisible, setIsToastVisible] = useState(false)

  return <Post postId={postId} type='standalone' setIsToastVisible={setIsToastVisible} />
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
      redirect: {
        permanent: false,
        destination: '/404',
      },
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  }
}
