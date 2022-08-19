import { ActionIcon, Avatar, Box, Group, Text } from '@mantine/core'
import React from 'react'
import { MdMoreHoriz } from 'react-icons/md'

const PostHeader = ({ username, avatar, type }: { username: string; avatar: string; type: 'mobile' | 'desktop' }) => {
  return (
    <Group
      id='comments-header'
      p='0.5rem'
      position='apart'
      sx={{
        minHeight: '7%',
        borderBottom: '1px solid lightgray',
        '@media (min-width: 956px)': { display: type === 'mobile' ? 'none' : '' },
        '@media (max-width: 956px)': { display: type === 'desktop' ? '' : 'none' },
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar radius='xl' src={avatar} />
        <Text weight='bold' size='sm' px='1rem' color='#262626'>
          {username}
        </Text>
      </Box>
      <Box>
        <ActionIcon variant='transparent'>
          <MdMoreHoriz size={30} />
        </ActionIcon>
      </Box>
    </Group>
  )
}

export default PostHeader
