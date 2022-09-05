import { ActionIcon } from '@mantine/core'
import React from 'react'
import { IoChatbubbleOutline } from 'react-icons/io5'

const CommentButton = () => {
  return (
    <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
      <IoChatbubbleOutline size='1.5rem' />
    </ActionIcon>
  )
}

export default CommentButton
