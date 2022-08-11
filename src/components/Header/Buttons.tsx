import { ActionIcon, Avatar, Box, Divider, Menu } from '@mantine/core'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { HiOutlineUserCircle, HiSwitchVertical } from 'react-icons/hi'
import {
  IoBookmarkOutline,
  IoChatbubbleEllipsesOutline,
  IoCompassOutline,
  IoHeartOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { MdHome, MdOutlineAddBox } from 'react-icons/md'

import AddPostModal from './AddPostModal'

const Buttons = () => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const router = useRouter()
  const { data } = useSession()

  

  return (
    <>
      {isModalOpened && <AddPostModal isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened} />}

      <Box sx={{ height: '36px', display: 'flex', alignItems: 'center' }}>
        {/* Button to home page */}
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <MdHome size='1.8rem' />
        </ActionIcon>
        {/* Button to messages */}
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoChatbubbleEllipsesOutline size='1.6rem' />
        </ActionIcon>
        {/* Button to add post */}
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem' onClick={() => setIsModalOpened(true)}>
          <MdOutlineAddBox size='1.8rem' />
        </ActionIcon>
        {/* Button ??? */}
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoCompassOutline size='1.8rem' />
        </ActionIcon>
        {/* Button to favorites */}
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoHeartOutline size='1.8rem' />
        </ActionIcon>

        {/* Avatar menu */}
        <Menu shadow='md' width={200} withArrow>
          <Menu.Target>
            <Avatar radius='xl' mx='0.4rem' sx={{ cursor: 'pointer' }} />
          </Menu.Target>
          <Menu.Dropdown p={0}>
            <Menu.Item icon={<HiOutlineUserCircle size={16} />} onClick={() => router.push(`/${data?.user.name}`)}>
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
