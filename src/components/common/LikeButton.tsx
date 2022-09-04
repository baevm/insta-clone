import { ActionIcon } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'
import {
  IoHeart, IoHeartOutline
} from 'react-icons/io5'
import { User } from '../../types/app.types'
import { trpc } from '../../utils/trpc'

type Props = {
  likes: User[]
  postId: string
}

const LikeButton = ({ likes, postId }: Props) => {
  const { data } = useSession()
  const utils = trpc.useContext()

  const addLike = trpc.useMutation('post.like-post', {
    async onMutate() {
      await utils.cancelQuery(['post.get-post', { postId }])
      const snapshot = utils.getQueryData(['post.get-post', { postId }])
      const likedUser = { id: data!.user.id, name: data!.user.name, avatar: data!.user.avatar }

      utils.setQueryData(['post.get-post', { postId }], {
        post: {
          ...snapshot!.post,
          likedUsers: [...snapshot!.post.likedUsers, likedUser],
        },
      })
      return { snapshot }
    },
  })

  const removeLike = trpc.useMutation('post.unlike-post', {
    async onMutate() {
      await utils.cancelQuery(['post.get-post', { postId }])
      const snapshot = utils.getQueryData(['post.get-post', { postId }])

      utils.setQueryData(['post.get-post', { postId }], {
        post: {
          ...snapshot!.post,
          likedUsers: snapshot!.post.likedUsers.filter((user) => user?.id !== data?.user.id),
        },
      })
      return { snapshot }
    },
  })

  return likes.find((like: any) => like.id === data?.user.id) ? (
    <ActionIcon variant='transparent' color='dark' mr='0.5rem' onClick={() => removeLike.mutate({ postId })}>
      <IoHeart size={30} color='tomato' />
    </ActionIcon>
  ) : (
    <ActionIcon variant='transparent' color='dark' mr='0.5rem' onClick={() => addLike.mutate({ postId })}>
      <IoHeartOutline size={30} />
    </ActionIcon>
  )
}

export default React.memo(LikeButton)
