import { ActionIcon, Anchor, Box, Card, Divider, Group, Skeleton, Text, Textarea } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleOutline, IoHeart, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { Post, User } from '../../types/app.types'
import { formatDate } from '../../utils/formatDate'
import { trpc } from '../../utils/trpc'

type Props = {
  post: Post
}

const PostCardControls = ({ post }: Props) => {
  const { data, status } = useSession()
  const utils = trpc.useContext()
  const [newComment, setNewComment] = useState('')
  const [likesCount, setLikesCount] = useState(post.likedUsers.length)

  const addLike = trpc.useMutation(['post.like-post'], {
    async onSuccess() {
      await utils.invalidateQueries('post.get-feed')
      setLikesCount(likesCount + 1)
    },
  })

  const removeLike = trpc.useMutation(['post.unlike-post'], {
    async onSuccess() {
      await utils.invalidateQueries('post.get-feed')
      setLikesCount(likesCount - 1)
    },
  })

  const addComment = trpc.useMutation(['post.add-comment'])

  const LikeButton = () => {
    return checkIsLiked({ likedUsers: post.likedUsers, userSessionId: data?.user.id }) ? (
      <ActionIcon variant='transparent' color='dark' mr='0.5rem' onClick={() => removeLike.mutate({ postId: post.id })}>
        <IoHeart size={30} color='tomato' />
      </ActionIcon>
    ) : (
      <ActionIcon variant='transparent' color='dark' mr='0.5rem' onClick={() => addLike.mutate({ postId: post.id })}>
        <IoHeartOutline size={30} />
      </ActionIcon>
    )
  }

  const checkIsLiked = ({ likedUsers, userSessionId }: { likedUsers: User[]; userSessionId: string | undefined }) => {
    return likedUsers.find((like: any) => like.id === userSessionId)
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
            {likesCount} likes
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
        <Textarea
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Add a comment'
          styles={(theme) => ({
            input: {
              border: '0px solid black',
            },
          })}
        />
      </Card.Section>
    </>
  )
}

export default PostCardControls
