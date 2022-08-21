import { ActionIcon, Anchor, Avatar, Box, Button, Group, Popover, Text } from '@mantine/core'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { getTimeAgo } from '../../../utils/formatDate'
import { trpc } from '../../../utils/trpc'

type Props = {
  avatar: string
  name: string
  authUserName: string | undefined
  date: string
  text: string
  commentId: string
}

const Comment = ({ avatar, name, text, date, authUserName, commentId }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const deleteComment = trpc.useMutation('post.delete-comment')

  return (
    <Box
      mb='1rem'
      sx={{
        display: 'flex',
        width: '100%',
      }}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Link href={`/${name}`} passHref>
          <Anchor>
            <Avatar src={avatar} mr='0.5rem' radius='xl' alt='avatar' />
          </Anchor>
        </Link>
        <Box sx={{ width: '100%' }}>
          <Group position='apart' align='center' sx={{ width: '100%', fontSize: '14px' }} py='0.2rem' color='black'>
            <Box>
              <Link href={`/${name}`} passHref>
                <Anchor underline={false} color='dark' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {name}
                </Anchor>
              </Link>{' '}
              {text}
            </Box>
            {authUserName === name && (
              <Popover width={100} position='bottom' withArrow shadow='md'>
                <Popover.Target>
                  <ActionIcon>
                    <MdMoreHoriz />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Button
                    variant='white'
                    fullWidth
                    compact
                    color='red'
                    onClick={() => deleteComment.mutate({ commentId })}>
                    Delete
                  </Button>
                </Popover.Dropdown>
              </Popover>
            )}
          </Group>

          <Text size='xs' color='gray'>
            {getTimeAgo(date)}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default React.memo(Comment)
