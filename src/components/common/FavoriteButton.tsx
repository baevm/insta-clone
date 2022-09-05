import { ActionIcon } from '@mantine/core'
import React from 'react'
import { IoBookmarkOutline } from 'react-icons/io5'

const FavoriteButton = () => {
  return (
    <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
      <IoBookmarkOutline size='1.5rem' />
    </ActionIcon>
  )
}

export default FavoriteButton
