import { ActionIcon, Anchor, Box, Button, Group, Text, Textarea } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleEllipsesOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { User } from '../../../types/app.types'
import { trpc } from '../../../utils/trpc'
import LikeButton from '../../common/LikeButton'

type Props = {
  postId: string
  likes: User[]
}

const CommentControls = ({ postId, likes }: Props) => {
  const utils = trpc.useContext()
  const { data } = useSession()
  const [comment, setComment] = useState('')
  const addComment = trpc.useMutation('post.add-comment', {
    async onSuccess(res) {
      const snapshot = utils.getQueryData(['post.get-post', { postId }])

      utils.setQueryData(['post.get-post', { postId }], {
        post: {
          ...snapshot!.post,
          comments: [res.commentAdded, ...snapshot!.post.comments],
        },
      })
      return { snapshot }
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

  return (
    <Box id='comments-controls' sx={{ height: '155px', width: '100%', borderTop: '1px solid lightgray' }}>
      <Box p='0.5rem' sx={{ borderBottom: '1px solid lightgray', height: '75px' }}>
        {data?.user && (
          <Group position='apart' mb='0.5rem'>
            <Box sx={{ display: 'flex' }}>
              <LikeButton likes={likes} postId={postId} />
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
            disabled={addComment.isLoading}
            sx={{ height: '100%', width: '85%' }}
            autosize={false}
            minRows={3}
            size='xs'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add a comment...'
          />
          <Button size='xs' sx={{ width: '15%' }} onClick={handleComment} loading={addComment.isLoading}>
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
