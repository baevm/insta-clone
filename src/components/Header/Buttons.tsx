import { ActionIcon, Avatar, Box, Divider, Menu } from '@mantine/core'
import { signOut } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { HiOutlineUserCircle, HiSwitchVertical } from 'react-icons/hi'
import {
  IoBookmarkOutline,
  IoChatbubbleEllipsesOutline,
  IoCompassOutline,
  IoHeartOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoSettingsOutline,
} from 'react-icons/io5'
import { MdOutlineAddBox } from 'react-icons/md'

const AddPostModal = dynamic(() => import('./AddPostModal'), { ssr: false })

const Buttons = ({ avatar, name }: { avatar: string; name: string }) => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const router = useRouter()

  return (
    <>
      {isModalOpened && (
        <AddPostModal isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened} name={name} avatar={avatar} />
      )}

      <Box sx={{ height: '36px', display: 'flex', alignItems: 'center' }}>
        {/* Button to home page */}
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem' onClick={() => router.push('/')}>
          {router.asPath === '/' ? <IoHomeSharp size='1.6rem' /> : <IoHomeOutline size='1.6rem' />}
        </ActionIcon>
        {/* Button to messages */}
        <ActionIcon disabled color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoChatbubbleEllipsesOutline size='1.6rem' />
        </ActionIcon>
        {/* Button to create post */}
        <ActionIcon
          color='dark'
          variant='transparent'
          aria-label='Create post'
          size='lg'
          mx='0.4rem'
          onClick={() => setIsModalOpened(true)}>
          <MdOutlineAddBox size='1.8rem' />
        </ActionIcon>
        {/* Button ??? */}
        <ActionIcon disabled color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoCompassOutline size='1.8rem' />
        </ActionIcon>
        {/* Button to favorites */}
        <ActionIcon disabled color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoHeartOutline size='1.8rem' />
        </ActionIcon>

        {/* Avatar menu */}
        <Menu shadow='md' width={200} withArrow>
          <Menu.Target>
            <Avatar src={avatar ? avatar : ''} radius='xl' mx='0.4rem' sx={{ cursor: 'pointer' }} />
          </Menu.Target>
          <Menu.Dropdown p={0}>
            <Menu.Item icon={<HiOutlineUserCircle size={16} />} onClick={() => router.push(`/${name}`)}>
              Profile
            </Menu.Item>
            <Menu.Item icon={<IoBookmarkOutline size={16} />}>Saved</Menu.Item>
            <Menu.Item icon={<IoSettingsOutline size={16} />}>Settings</Menu.Item>
            <Menu.Item icon={<HiSwitchVertical size={16} />}>Switch accounts</Menu.Item>
            <Divider />
            <Menu.Item onClick={() => signOut()}>Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  )
}

export default React.memo(Buttons)
