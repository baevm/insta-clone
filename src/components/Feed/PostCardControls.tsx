import { ActionIcon, Anchor, Box, Button, Card, Divider, Group, Skeleton, Text, Textarea } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleOutline, IoHeart, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { Post } from '../../types/app.types'
import { formatDate } from '../../utils/formatDate'
import { trpc } from '../../utils/trpc'

type Props = {
  post: Post
}

const PostCardControls = ({ post }: Props) => {
  const { data, status } = useSession()
  const utils = trpc.useContext()
  const [newComment, setNewComment] = useState('')

  const addLike = trpc.useMutation(['post.like-post'], {
    async onMutate() {
      await utils.cancelQuery(['feed.get-feed', { limit: 5 }])
      const snapshot = utils.getInfiniteQueryData(['feed.get-feed', { limit: 5 }])
      const likedUser = { id: data!.user.id, name: data!.user.name, avatar: data!.user.avatar }

      utils.setInfiniteQueryData(['feed.get-feed', { limit: 5 }], () => {
        return {
          pageParams: snapshot!.pageParams,
          pages: snapshot!.pages.map((feed) => {
            return {
              feed: feed.feed.map((f: any) => {
                if (f.id === post.id) {
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
    },
  })

  const removeLike = trpc.useMutation(['post.unlike-post'], {
    async onSuccess() {
      utils.invalidateQueries(['feed.get-feed'])
    },
  })

  const addComment = trpc.useMutation(['post.add-comment'], {
    onSuccess() {
      utils.invalidateQueries(['feed.get-feed'])
    },
  })

  const LikeButton = () => {
    return post.likedUsers.find((like: any) => like.id === data?.user.id) ? (
      <ActionIcon variant='transparent' color='dark' mr='0.5rem' onClick={() => removeLike.mutate({ postId: post.id })}>
        <IoHeart size={30} color='tomato' />
      </ActionIcon>
    ) : (
      <ActionIcon variant='transparent' color='dark' mr='0.5rem' onClick={() => addLike.mutate({ postId: post.id })}>
        <IoHeartOutline size={30} />
      </ActionIcon>
    )
  }

  const handleComment = () => {
    if (!newComment) return
    addComment.mutate({
      postId: post.id,
      comment: newComment,
    })
    setNewComment('')
  }

  return (
    <>
      <Card.Section py='xs' px='xs'>
        <Group position='apart'>
          {status === 'loading' ? (
            <Skeleton width='200' height='30' />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LikeButton />
              <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
                <IoChatbubbleOutline size='1.5rem' />
              </ActionIcon>
              <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
                <IoPaperPlaneOutline size='1.5rem' />
              </ActionIcon>
            </Box>
          )}

          <Box>
            <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
              <IoBookmarkOutline size='1.5rem' />
            </ActionIcon>
          </Box>
        </Group>
      </Card.Section>

      <Card.Section px='xs'>
        <Box>
          <Text weight='bold' size='sm'>
            {post.likedUsers.length} likes
          </Text>
        </Box>

        <Box py='xs'>
          {post.comments.length > 0 && (
            <Box color='black' sx={{ fontSize: '14px' }}>
              <Box component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {post.comments[0].User?.name}
              </Box>{' '}
              {post.comments[0].body}
            </Box>
          )}

          <Box>
            <Text size='sm'>
              <Link href={`/p/${post.id}`} passHref>
                <Anchor underline={false} color='gray'>
                  View all comments
                </Anchor>
              </Link>
            </Text>
            <Box>
              <Text size='xs' color='gray'>
                {formatDate(post.createdAt)}
              </Text>
            </Box>
          </Box>
        </Box>
      </Card.Section>

      <Card.Section>
        <Divider />
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Textarea
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            placeholder='Add a comment'
            maxRows={4}
            minRows={1}
            autosize={true}
            sx={{ width: '80%' }}
            styles={(theme) => ({
              input: {
                border: 0,
              },
            })}
          />
          <Button
            variant='subtle'
            sx={{ width: '20%' }}
            onClick={handleComment}
            disabled={!newComment}
            loading={addComment.isLoading}>
            Post
          </Button>
        </Box>
      </Card.Section>
    </>
  )
}

export default PostCardControls
