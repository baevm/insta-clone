import { ActionIcon, Anchor, Avatar, Box, Button, Center, Input, Modal, Skeleton, Text, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown, MdMoreHoriz } from 'react-icons/md'
import { ProfileProps } from '../../types/app.types'
import { trpc } from '../../utils/trpc'
import UploadAvatarModal from './UploadAvatarModal'

const ProfileHeader = ({ profile }: { profile: ProfileProps }) => {
  const utils = trpc.useContext()
  const [isModalOpened, setIsModalOpened] = useState<{ type: 'followers' | 'following' | ''; isOpen: boolean }>({
    type: '',
    isOpen: false,
  })
  const [avatarModal, setAvatarModal] = useState(false)
  const { data, status } = useSession()

  const handleFollow = trpc.useMutation('follow.follow', {
    onSuccess() {
      utils.invalidateQueries('user.get-profile')
    },
  })

  const handleUnfollow = trpc.useMutation('follow.unfollow', {
    onSuccess() {
      utils.invalidateQueries('user.get-profile')
    },
  })

  const ModalItem = ({ name, avatar }: { name: string; avatar: string }) => {
    return (
      <Box
        p='0.5rem'
        sx={{ width: '100%', display: 'flex', alignItems: 'center', borderBottom: '1px solid lightgray' }}>
        <Link href={`/${name}`} passHref>
          <Anchor onClick={() => setIsModalOpened({ type: '', isOpen: false })}>
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
            onClick={() => setIsModalOpened({ type: '', isOpen: false })}>
            {name}
          </Anchor>
        </Link>
      </Box>
    )
  }

  return (
    <>
      <Modal
        opened={isModalOpened.isOpen}
        onClose={() => setIsModalOpened({ type: '', isOpen: false })}
        centered
        sx={{ zIndex: 2000 }}
        padding={0}
        withCloseButton={false}
        size='xs'>
        <Center sx={{ flexDirection: 'column' }}>
          <Title order={6} p='0.5rem' sx={{ textTransform: 'uppercase' }}>
            {isModalOpened.type}
          </Title>

          <Input placeholder='Search...' radius={0} sx={{ width: '100%' }} />

          <Box sx={{ width: '100%', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {isModalOpened.type === 'followers'
              ? profile.followedBy.map((f: any) => <ModalItem avatar={f.avatar} name={f.name} key={f.id} />)
              : profile.following.map((f: any) => <ModalItem avatar={f.avatar} name={f.name} key={f.id} />)}
          </Box>
        </Center>
      </Modal>

      <UploadAvatarModal avatarModal={avatarModal} setAvatarModal={setAvatarModal} />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Box
          mb='4rem'
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
          <Avatar
            size={150}
            radius={100}
            src={profile.avatar ? profile.avatar : ''}
            sx={{ cursor: 'pointer' }}
            onClick={() => setAvatarModal(true)}
          />

          <Box sx={{ width: '100%', paddingLeft: '2rem', '@media (min-width: 556px)': { paddingLeft: '5rem' } }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                '@media (max-width: 556px)': { flexDirection: 'column', alignItems: 'flex-start' },
              }}>
              <Title order={2} sx={{ fontWeight: 'lighter' }} mr='1.5rem'>
                {profile.name}
              </Title>

              {/* If my profile show edit button, else show follow controls */}
              {status === 'loading' ? (
                <Skeleton width='300px' height='30px' />
              ) : data?.user.name === profile.name ? (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', '@media (min-width: 556px)': { marginLeft: '2rem' } }}>
                  <Button size='xs' variant='default' color='dark' sx={{ fontSize: '14px' }}>
                    Edit profile
                  </Button>
                  <ActionIcon ml='0.5rem' variant='transparent' color='dark'>
                    <IoSettingsOutline size={20} />
                  </ActionIcon>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* If followed show followed text and unfollow button, else show follow button */}
                  {profile.followedBy.find((f: any) => f.name === data?.user.name) ? (
                    <>
                      <Text color='gray' size='xs'>
                        Followed
                      </Text>
                      <Button
                        size='xs'
                        px='1.5rem'
                        ml='0.5rem'
                        onClick={() => handleUnfollow.mutate({ userId: profile.id })}>
                        Unfollow
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size='xs' px='1.5rem' onClick={() => handleFollow.mutate({ userId: profile.id })}>
                        Follow
                      </Button>
                      <ActionIcon ml='0.5rem' variant='filled' color='blue'>
                        <MdKeyboardArrowDown size={20} />
                      </ActionIcon>
                      <ActionIcon ml='1rem'>
                        <MdMoreHoriz size={30} />
                      </ActionIcon>
                    </>
                  )}
                </Box>
              )}
            </Box>

            <Box
              pt='1rem'
              sx={{
                width: '50%',
                display: 'flex',
                justifyContent: 'space-between',
                '@media (max-width: 756px)': { display: 'none' },
              }}>
              <Text>
                <Text span weight='bold'>
                  {profile.posts.length}
                </Text>{' '}
                posts
              </Text>
              <Text onClick={() => setIsModalOpened({ type: 'followers', isOpen: true })} sx={{ cursor: 'pointer' }}>
                <Text span weight='bold'>
                  {profile.followedBy.length}
                </Text>{' '}
                followers
              </Text>
              <Text onClick={() => setIsModalOpened({ type: 'following', isOpen: true })} sx={{ cursor: 'pointer' }}>
                <Text span weight='bold'>
                  {profile.following.length}
                </Text>{' '}
                following
              </Text>
            </Box>

            <Box pt='1rem'>
              <Text>{profile.description ? profile.description : ''}</Text>
            </Box>
          </Box>
        </Box>

        {/* Block only showing on mobile */}
        <Box
          py='1rem'
          px='2rem'
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid lightgray',
            '@media (min-width: 756px)': { display: 'none' },
          }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Text weight='bold'>{profile.posts.length}</Text> <Text color='gray'>posts</Text>
          </Box>
          <Box
            sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={() => setIsModalOpened({ type: 'followers', isOpen: true })}>
            <Text weight='bold'>{profile.followedBy.length}</Text> <Text color='gray'>followers</Text>
          </Box>
          <Box
            sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={() => setIsModalOpened({ type: 'following', isOpen: true })}>
            <Text weight='bold'>{profile.following.length}</Text> <Text color='gray'>following</Text>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ProfileHeader
