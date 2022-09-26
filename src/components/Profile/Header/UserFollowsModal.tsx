import { Anchor, Avatar, Box, Center, Input, Modal, Title } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { ProfileProps } from '../../../types/app.types'

const UserFollowsModal = ({ isFollowsModal, setIsFollowsModal, profile }: {isFollowsModal: any, setIsFollowsModal: any, profile: ProfileProps}) => {
  return (
    <Modal
      opened={isFollowsModal.isOpen}
      onClose={() => setIsFollowsModal({ type: '', isOpen: false })}
      centered
      sx={{ zIndex: 2000 }}
      padding={0}
      withCloseButton={false}
      size='xs'>
      <Center sx={{ flexDirection: 'column' }}>
        <Title order={6} p='0.5rem' sx={{ textTransform: 'uppercase' }}>
          {isFollowsModal.type}
        </Title>

        <Input placeholder='Search...' radius={0} sx={{ width: '100%' }} />

        <Box sx={{ width: '100%', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {isFollowsModal.type === 'followers'
            ? profile.followedBy.map((f: any) => (
                <ModalItem avatar={f.avatar} name={f.name} key={f.id} setIsFollowsModal={setIsFollowsModal} />
              ))
            : profile.following.map((f: any) => (
                <ModalItem avatar={f.avatar} name={f.name} key={f.id} setIsFollowsModal={setIsFollowsModal} />
              ))}
        </Box>
      </Center>
    </Modal>
  )
}

export default UserFollowsModal

const ModalItem = ({ name, avatar, setIsFollowsModal }: { name: string; avatar: string; setIsFollowsModal: any }) => {
  return (
    <Box p='0.5rem' sx={{ width: '100%', display: 'flex', alignItems: 'center', borderBottom: '1px solid lightgray' }}>
      <Link href={`/${name}`} passHref>
        <Anchor onClick={() => setIsFollowsModal({ type: '', isOpen: false })}>
          <Avatar src={avatar ? avatar : ''} radius='xl' />
        </Anchor>
      </Link>
      <Link href={`/${name}`} passHref>
        <Anchor
          ml='0.5rem'
          underline={false}
          color='dark'
          weight='bold'
          size='sm'
          onClick={() => setIsFollowsModal({ type: '', isOpen: false })}>
          {name}
        </Anchor>
      </Link>
    </Box>
  )
}
