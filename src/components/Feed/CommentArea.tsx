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

const CommentArea = ({ post }: Props) => {
  const utils = trpc.useContext()
  const [newComment, setNewComment] = useState('')
  const addComment = trpc.useMutation(['post.add-comment'], {
    onSuccess() {
      utils.invalidateQueries(['feed.get-feed'])
    },
  })

  const handleComment = () => {
    if (!newComment) return
    addComment.mutate({
      postId: post.id,
      comment: newComment,
    })
    setNewComment('')
  }

  return (
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
        variant='white'
        sx={{ width: '20%' }}
        onClick={handleComment}
        disabled={!newComment}
        loading={addComment.isLoading}
        styles={{
          root: {
            '&:disabled': {
              backgroundColor: 'white',
            },
          },
        }}>
        Post
      </Button>
    </Box>
  )
}

export default CommentArea
