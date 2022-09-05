import { ActionIcon } from '@mantine/core'
import React from 'react'
import { IoPaperPlaneOutline } from 'react-icons/io5'

const ShareButton = () => {
  return (
    <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
      <IoPaperPlaneOutline size='1.5rem' />
    </ActionIcon>
  )
}

export default ShareButton
