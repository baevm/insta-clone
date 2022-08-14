import { ActionIcon, Avatar, Box, Button, Text, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'
import { MdKeyboardArrowDown, MdMoreHoriz } from 'react-icons/md'
import { IoSettingsOutline } from 'react-icons/io5'

const ProfileHeader = ({ profile }: any) => {
  const session = useSession()
  const sessionUser = session.data?.user

  

  return (
    <Box mb='4rem' sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Avatar size={150} radius={100} src={profile.avatar ? profile.avatar : ''} />

      <Box pl='5rem' sx={{ width: '100%' }}>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Title order={2} sx={{ fontWeight: 'lighter' }}>
            {profile.name}
          </Title>

          {sessionUser?.name === profile.name ? (
            <Box ml='2rem' sx={{ display: 'flex', alignItems: 'center' }}>
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

        <Box pt='1rem' sx={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
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
  )
}

export default ProfileHeader
