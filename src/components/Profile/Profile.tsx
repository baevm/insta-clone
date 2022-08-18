import { Box, Center, Container, Grid, Modal, Tabs, Title } from '@mantine/core'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoMdGrid } from 'react-icons/io'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { ProfileProps } from '../../types/profile.type'
import Post from './Post'
import ProfileHeader from './ProfileHeader'

const Profile: React.FC<{ profile: ProfileProps }> = ({ profile }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>('/')

  const handleTabChange = (value: any) => {
    setActiveTab(value)
    const path = value === '/' ? `/${profile.name}` : `/${profile.name}/${value}`
    router.push(`${path}`)
  }

  const displaySortedPosts = () => {
    const sortedPosts = profile.posts
      .sort((a: any, b: any) => -a.createdAt.localeCompare(b.createdAt))
      .map((post: any) => <Post post={post} username={profile.name} avatar={profile.avatar} key={post.id} />)
    return sortedPosts
  }


  return (
    <Container
      size={935}
      px={0}
      py='2rem'
      sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProfileHeader profile={profile} />

      <Box sx={{ width: '100%' }}>
        <Tabs value={activeTab} onTabChange={handleTabChange} color='dark' inverted>
          <Tabs.List position='center'>
            <Tabs.Tab value='/' icon={<IoMdGrid />} sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
              Posts
            </Tabs.Tab>
            <Tabs.Tab
              value='tagged'
              icon={<RiAccountPinBoxLine />}
              sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
              Tagged
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='/'>
            {profile.posts.length > 0 ? (
              <Grid py='1rem'>{displaySortedPosts()}</Grid>
            ) : (
              <Center sx={{ height: '500px', flexDirection: 'column' }}>
                <MdOutlinePhotoCamera size={40} />
                <Title order={3} sx={{ fontWeight: 'normal' }}>
                  No Posts Yet
                </Title>
              </Center>
            )}
          </Tabs.Panel>
          <Tabs.Panel value='saved'>Saved</Tabs.Panel>
          <Tabs.Panel value='tagged'>Tagged</Tabs.Panel>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Profile
