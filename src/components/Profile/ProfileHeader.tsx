import { ActionIcon, Avatar, Box, Button, Text, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'
import { MdKeyboardArrowDown, MdMoreHoriz } from 'react-icons/md'
import { IoSettingsOutline } from 'react-icons/io5'

const ProfileHeader = ({ profile }: any) => {
  const session = useSession()
  const sessionUser = session.data?.user

  return (
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
        <Avatar size={150} radius={100} src={profile.avatar ? profile.avatar : ''} />

        <Box sx={{ width: '100%', paddingLeft: '2rem', '@media (min-width: 556px)': { paddingLeft: '5rem' } }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              '@media (max-width: 556px)': { flexDirection: 'column', alignItems: 'flex-start' },
            }}>
            <Title order={2} sx={{ fontWeight: 'lighter' }}>
              {profile.name}
            </Title>

            {sessionUser?.name === profile.name ? (
              <Box sx={{ display: 'flex', alignItems: 'center', '@media (min-width: 556px)': { marginLeft: '2rem' } }}>
                <Button size='xs' variant='default' color='dark' sx={{ fontSize: '14px' }}>
                  Edit profile
                </Button>
                <ActionIcon ml='0.5rem' variant='transparent' color='dark'>
                  <IoSettingsOutline size={20} />
                </ActionIcon>
              </Box>
            ) : (
              <Box ml='2rem' sx={{ display: 'flex', alignItems: 'center' }}>
                <Button size='xs' px='1.5rem'>
                  Follow
                </Button>
                <ActionIcon ml='0.5rem' variant='filled' color='blue'>
                  <MdKeyboardArrowDown size={20} />
                </ActionIcon>
                <ActionIcon ml='1rem'>
                  <MdMoreHoriz size={30} />
                </ActionIcon>
              </Box>
            )}
          </Box>

          <Box
            pt='1rem'
            sx={{
              width: '50%',
              display: 'flex',
              justifyContent: 'space-between',
              '@media (max-width: 556px)': { display: 'none' },
            }}>
            <Text>
              <Text span weight='bold'>
                {profile.posts.length}
              </Text>{' '}
              posts
            </Text>
            <Text>
              <Text span weight='bold'>
                {profile.followedBy.length}
              </Text>{' '}
              followers
            </Text>
            <Text>
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

      <Box
        py='1rem'
        px='2rem'
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid lightgray',
          '@media (min-width: 556px)': { display: 'none' },
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text weight='bold'>{profile.posts.length}</Text> <Text color='gray'>posts</Text>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text weight='bold'>{profile.followedBy.length}</Text> <Text color='gray'>followers</Text>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text weight='bold'>{profile.following.length}</Text> <Text color='gray'>following</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileHeader
