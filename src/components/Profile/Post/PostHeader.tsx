import { ActionIcon, Avatar, Box, Center, Group, Modal, Text } from '@mantine/core'
import React, { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'

const PostHeader = ({ username, avatar, type }: { username: string; avatar: string; type: 'mobile' | 'desktop' }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <>
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
          <ActionIcon variant='transparent' onClick={() => setIsOpenModal(true)}>
            <MdMoreHoriz size={30} />
          </ActionIcon>
        </Box>
      </Group>

      <Modal
        opened={isOpenModal}
        centered
        size='sm'
        onClose={() => setIsOpenModal(false)}
        withCloseButton={false}
        padding={0}
        zIndex={3000}
        styles={(theme) => ({
          modal: {
            borderRadius: '10px',
          },
        })}>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
          Delete
        </Center>

        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Share to</Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Copy link</Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Embed</Center>
        <Center
          sx={{ padding: '0.5rem', cursor: 'pointer' }}
          onClick={() => {
            setIsOpenModal(false)
          }}>
          Cancel
        </Center>
      </Modal>
    </>
  )
}

export default PostHeader
