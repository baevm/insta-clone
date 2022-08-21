import { useState } from 'react'
import PostContainer from '../../components/Profile/Post/PostContainer'
import prisma from '../../utils/prisma'

const PhotoPage = ({ post }: any) => {
  const [isToastVisible, setIsToastVisible] = useState(false)
  

  return (
    <PostContainer
      avatar={post.User.avatar}
      post={post}
      name={post.User.name}
      type='standalone'
      setIsToastVisible={setIsToastVisible}
    />
  )
}

export default PhotoPage

export const getServerSideProps = async (ctx: any) => {
  const post = await prisma.post.findUnique({
    where: {
      id: ctx.query.photo,
    },

    include: {
      User: {
        select: {
          name: true,
          avatar: true,
          id: true,
        },
      },
      comments: {
        include: {
          User: true,
        },
      },
    },
  })

  return { props: { post: JSON.parse(JSON.stringify(post)) } }
}
