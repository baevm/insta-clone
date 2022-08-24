import { ActionIcon, Anchor, Box, Button, Group, Text, Textarea } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  IoBookmarkOutline,
  IoChatbubbleEllipsesOutline,
  IoHeartOutline,
  IoPaperPlaneOutline,
  IoHeart,
} from 'react-icons/io5'
import { trpc } from '../../../utils/trpc'

type Props = {
  postId: string
  likes: string[]
}

const CommentControls = ({ postId, likes }: Props) => {
  const utils = trpc.useContext()
  const { data } = useSession()
  const [comment, setComment] = useState('')
  const addComment = trpc.useMutation('post.add-comment', {
    onSuccess() {
      utils.invalidateQueries('user.get-profile') // if on post modal
      utils.invalidateQueries('post.get-post') // if on post page
    },
  })
  const addLike = trpc.useMutation('post.like-post', {
    onSuccess() {
      utils.invalidateQueries('user.get-profile') // if on post modal
      utils.invalidateQueries('post.get-post') // if on post page
    },
  })
  const removeLike = trpc.useMutation('post.unlike-post', {
    onSuccess() {
      utils.invalidateQueries('user.get-profile') // if on post modal
      utils.invalidateQueries('post.get-post') // if on post page
    },
  })

  const handleComment = () => {
    if (!comment) return
    addComment.mutate({
      postId,
      comment: comment,
    })
    setComment('')
  }

  const LikeButton = () => {
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

  return (
    <Box id='comments-controls' sx={{ height: '155px', width: '100%', borderTop: '1px solid lightgray' }}>
      <Box p='0.5rem' sx={{ borderBottom: '1px solid lightgray', height: '75px' }}>
        {data?.user && (
          <Group position='apart' mb='0.5rem'>
            <Box sx={{ display: 'flex' }}>
              {LikeButton()}
              <ActionIcon variant='transparent' color='dark' mx='0.5rem'>
                <IoChatbubbleEllipsesOutline size={30} />
              </ActionIcon>
              <ActionIcon variant='transparent' color='dark' mx='0.5rem'>
                <IoPaperPlaneOutline size={30} />
              </ActionIcon>
            </Box>
            <Box>
              <ActionIcon variant='transparent' color='dark' mx='0.5rem'>
                <IoBookmarkOutline size={30} />
              </ActionIcon>
            </Box>
          </Group>
        )}

        <Box p='0.2rem'>
          <Text weight='bold' size='sm'>
            {likes.length} likes
          </Text>
        </Box>
      </Box>
      {data?.user ? (
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', height: '75px' }}>
          <Textarea
            variant='unstyled'
            px='0.5rem'
            sx={{ height: '100%', width: '85%' }}
            autosize={false}
            minRows={3}
            size='xs'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add a comment...'
          />
          <Button size='xs' onClick={handleComment}>
            add
          </Button>
        </Box>
      ) : (
        <Box p='0.5rem'>
          <Link href='/login' passHref>
            <Anchor>Log in</Anchor>
          </Link>{' '}
          to like or comment
        </Box>
      )}
    </Box>
  )
}

export default React.memo(CommentControls)
