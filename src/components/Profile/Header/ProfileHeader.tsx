import { ActionIcon, Avatar, Box, Button, Skeleton, Text, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown, MdMoreHoriz } from 'react-icons/md'
import { ProfileProps } from '../../../types/app.types'
import { trpc } from '../../../utils/trpc'
import UploadAvatarModal from './UploadAvatarModal'
import UserFollowsModal from './UserFollowsModal'

const ProfileHeader = ({ profile }: { profile: ProfileProps }) => {
  const utils = trpc.useContext()
  const [isFollowsModal, setIsFollowsModal] = useState<{ type: 'followers' | 'following' | ''; isOpen: boolean }>({
    type: '',
    isOpen: false,
  })
  const [isAvatarModal, setisAvatarModal] = useState(false)
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

  console.log(isAvatarModal)

  return (
    <>
      <UserFollowsModal isFollowsModal={isFollowsModal} setIsFollowsModal={setIsFollowsModal} profile={profile} />

      <UploadAvatarModal isAvatarModal={isAvatarModal} setIsAvatarModal={setisAvatarModal} />

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
            onClick={() => setisAvatarModal(true)}
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
              <Text onClick={() => setIsFollowsModal({ type: 'followers', isOpen: true })} sx={{ cursor: 'pointer' }}>
                <Text span weight='bold'>
                  {profile.followedBy.length}
                </Text>{' '}
                followers
              </Text>
              <Text onClick={() => setIsFollowsModal({ type: 'following', isOpen: true })} sx={{ cursor: 'pointer' }}>
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
            onClick={() => setIsFollowsModal({ type: 'followers', isOpen: true })}>
            <Text weight='bold'>{profile.followedBy.length}</Text> <Text color='gray'>followers</Text>
          </Box>
          <Box
            sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={() => setIsFollowsModal({ type: 'following', isOpen: true })}>
            <Text weight='bold'>{profile.following.length}</Text> <Text color='gray'>following</Text>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ProfileHeader
