import { Avatar, Box, Text } from '@mantine/core'
import React from 'react'
import { getTimeAgo } from '../../../utils/formatDate'

type Props = {
  avatar: string
  name: string
  date: string
  text: string
}

const Comment = ({ avatar, name, text, date }: Props) => {
  return (
    <Box
      mb='1rem'
      sx={{
        display: 'flex',
      }}>
      <Box sx={{ display: 'flex' }}>
        <Avatar src={avatar} mr='0.5rem' radius='xl' alt='avatar' />
        <Box>
          <Box py='0.2rem' color='black' sx={{ fontSize: '14px' }}>
            <Box component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
              {name}
            </Box>{' '}
            {text}
          </Box>

          <Text size='xs' color='gray'>
            {getTimeAgo(date)}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default React.memo(Comment)
