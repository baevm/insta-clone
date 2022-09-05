import { ActionIcon } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'
import { IoHeart, IoHeartOutline } from 'react-icons/io5'
import { User } from '../../types/app.types'
import { trpc } from '../../utils/trpc'

type Props = {
  likes: User[]
  postId: string
  type: 'feed' | 'post'
}

const LikeButton = ({ likes, postId, type }: Props) => {
  const { data } = useSession()
  const utils = trpc.useContext()

  const addLike = trpc.useMutation('post.like-post', {
    async onMutate() {
      const likedUser = { id: data!.user.id, name: data!.user.name, avatar: data!.user.avatar }
      if (type === 'post') {
        await utils.cancelQuery(['post.get-post', { postId }])
        const snapshot = utils.getQueryData(['post.get-post', { postId }])

        utils.setQueryData(['post.get-post', { postId }], {
          post: {
            ...snapshot!.post,
            likedUsers: [...snapshot!.post.likedUsers, likedUser],
          },
        })
        return { snapshot }
      } else if (type === 'feed') {
        await utils.cancelQuery(['feed.get-feed', { limit: 5 }])
        const snapshot = utils.getInfiniteQueryData(['feed.get-feed', { limit: 5 }])

        utils.setInfiniteQueryData(['feed.get-feed', { limit: 5 }], () => {
          return {
            pageParams: snapshot!.pageParams,
            pages: snapshot!.pages.map((feed) => {
              return {
                feed: feed.feed.map((f: any) => {
                  if (f.id === postId) {
                    return {
                      ...f,
                      likedUsers: [...f.likedUsers, likedUser],
                    }
                  }
                  return f
                }),
                nextCursor: feed.nextCursor,
              }
            }),
          }
        })
      }
    },
  })

  const removeLike = trpc.useMutation('post.unlike-post', {
    async onMutate() {
      const authId = data!.user.id
      if (type === 'post') {
        await utils.cancelQuery(['post.get-post', { postId }])
        const snapshot = utils.getQueryData(['post.get-post', { postId }])

        utils.setQueryData(['post.get-post', { postId }], {
          post: {
            ...snapshot!.post,
            likedUsers: snapshot!.post.likedUsers.filter((user) => user?.id !== authId),
          },
        })
        return { snapshot }
      } else if (type === 'feed') {
        await utils.cancelQuery(['feed.get-feed', { limit: 5 }])
        const snapshot = utils.getInfiniteQueryData(['feed.get-feed', { limit: 5 }])

        utils.setInfiniteQueryData(['feed.get-feed', { limit: 5 }], () => {
          return {
            pageParams: snapshot!.pageParams,
            pages: snapshot!.pages.map((feed) => {
              return {
                feed: feed.feed.map((f: any) => {
                  if (f.id === postId) {
                    return {
                      ...f,
                      likedUsers: f.likedUsers.filter((u: any) => u.id !== authId),
                    }
                  }
                  return f
                }),
                nextCursor: feed.nextCursor,
              }
            }),
          }
        })
      }
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
