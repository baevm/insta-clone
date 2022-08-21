import { Anchor, Avatar, Box, Text } from '@mantine/core'
import Link from 'next/link'
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
        <Link href={`/${name}`} passHref>
          <Anchor>
            <Avatar src={avatar} mr='0.5rem' radius='xl' alt='avatar' />
          </Anchor>
        </Link>
        <Box>
          <Box py='0.2rem' color='black' sx={{ fontSize: '14px' }}>
            <Link href={`/${name}`} passHref>
              <Anchor underline={false} color='dark' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {name}
              </Anchor>
            </Link>{' '}
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
