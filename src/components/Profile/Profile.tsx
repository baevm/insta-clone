import { ActionIcon, Avatar, Box, Button, Center, Container, Grid, Tabs, Text, Title } from '@mantine/core'
import React, { useState } from 'react'
import { MdKeyboardArrowDown, MdMoreHoriz } from 'react-icons/md'
import { IoMdGrid } from 'react-icons/io'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Profile = () => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<string | null>('/')
  const profile = {
    name: 'dezzerlol',
    postsCount: 300,
    followers: '1.5k',
    following: '1.5k',
    description: 'I am a software engineer',
    avatar: 'https://avatars0.githubusercontent.com/u/17098281?s=460&v=4',
    posts: [
      { id: 1, title: 'Post 1', caption: 'This is the body of post 1', image: 'https://picsum.photos/200' },
      { id: 2, title: 'Post 2', caption: 'This is the body of post 2', image: 'https://picsum.photos/200' },
      { id: 3, title: 'Post 2', caption: 'This is the body of post 2', image: 'https://picsum.photos/200' },
      { id: 4, title: 'Post 2', caption: 'This is the body of post 2', image: 'https://picsum.photos/200' },
    ],
  }

  const handleTabChange = (value: any) => {
    setActiveTab(value)
    const path = value === '/' ? `/${profile.name}` : `/${profile.name}/${value}`
    router.push(`${path}`)
  }
  return (
    <Container
      size={935}
      px={0}
      py='2rem'
      sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box mb='4rem' sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar size={150} radius={100} src={profile.avatar} />

        <Box pl='5rem' sx={{ width: '100%' }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Title order={2} sx={{ fontWeight: 'lighter' }}>
              {profile.name}
            </Title>
            <Button size='xs' px='1.5rem' ml='2rem'>
              Follow
            </Button>
            <ActionIcon ml='0.5rem' variant='filled' color='blue'>
              <MdKeyboardArrowDown size={20} />
            </ActionIcon>
            <ActionIcon ml='1rem'>
              <MdMoreHoriz size={30} />
            </ActionIcon>
          </Box>

          <Box pt='1rem' sx={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
            <Text>
              <Text span weight='bold'>
                {profile.postsCount}
              </Text>{' '}
              posts
            </Text>
            <Text>
              <Text span weight='bold'>
                {profile.followers}
              </Text>{' '}
              followers
            </Text>
            <Text>
              <Text span weight='bold'>
                {profile.following}
              </Text>{' '}
              following
            </Text>
          </Box>

          <Box pt='1rem'>
            <Text>{profile.description}</Text>
          </Box>
        </Box>
      </Box>

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
            <Grid py='1rem'>
              {profile.posts.map((post: any) => (
                <Grid.Col key={post.id} span={4}>
                  <Image src={'/post_test.webp'} alt='post' width='100%' height='100%' layout='responsive' quality={100}/>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value='tagged'>Tagged</Tabs.Panel>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Profile
