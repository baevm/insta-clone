import { ActionIcon, Box, Button, Group, Text, Textarea } from '@mantine/core'
import React, { useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleEllipsesOutline, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { trpc } from '../../../utils/trpc'

type Props = {
  postId: string
  likes: string
}

const CommentControls = ({ postId, likes }: Props) => {
  const [comment, setComment] = useState('')
  const { mutate } = trpc.useMutation('post.add-comment')

  const handleComment = () => {
    if (!comment) return
    mutate({
      postId,
      comment: comment,
    })
    setComment('')
  }
  return (
    <Box id='comments-controls' sx={{ minHeight: '18%', width: '100%', borderTop: '1px solid lightgray' }}>
      <Box p='0.5rem' sx={{ borderBottom: '1px solid lightgray' }}>
        <Group position='apart' mb='0.5rem'>
          <Box sx={{ display: 'flex' }}>
            <ActionIcon variant='transparent' color='dark' mr='0.5rem'>
              <IoHeartOutline size={30} />
            </ActionIcon>
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

        <Box p='0.2rem'>
          <Text weight='bold' size='sm'>
            {likes} likes
          </Text>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', height: '100%' }}>
        <Textarea
          variant='unstyled'
          px='0.5rem'
          sx={{ height: '100%', width: '85%' }}
          size='md'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Add a comment...'
        />
        <Button sx={{ width: '15%' }} onClick={handleComment}>
          add
        </Button>
      </Box>
    </Box>
  )
}

export default React.memo(CommentControls)
