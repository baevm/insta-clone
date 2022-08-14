import {
  ActionIcon,
  AspectRatio,
  Avatar,
  Box,
  Container,
  Grid,
  Group,
  Image,
  Input,
  Modal,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import NextImage from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { useDisableBodyScroll } from '../../utils/useDisableBodyScroll'
import { useOutsideClick } from '../../utils/useOutsideClick'
import { IoBookmarkOutline, IoChatbubbleEllipsesOutline, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'

const Post = ({ post }: any) => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useDisableBodyScroll(isModalOpened)
  useOutsideClick(modalRef, () => setIsModalOpened(false))

  console.log(post)

  return (
    <>
      <Grid.Col span={4} onClick={() => setIsModalOpened(true)} sx={{ cursor: 'pointer' }}>
        <NextImage src={post.image} alt='post' width='100%' height='100%' layout='responsive' quality={100} />
      </Grid.Col>

      {isModalOpened && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1040,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '-webkit-overflow-scrolling': 'none',
            overflow: 'hidden',
            touchAction: 'none',
            overscrollBehavior: 'none',
          }}>
          <Container
            size='xl'
            p={0}
            sx={{
              backgroundColor: 'white',
              width: '100%',
              height: '900px',
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              display: 'flex',
              flexDirection: 'row',
            }}
            ref={modalRef}>
            <Box sx={{ maxWidth: 850, width: '70%', backgroundColor: 'black', display: 'flex' }}>
              <AspectRatio ratio={1 / 1}>
                <Image src={post.image} alt='post' width={850} />
              </AspectRatio>
            </Box>

            <Box
              id='comments-section'
              sx={{ height: '100%', width: 'calc(100% - 850px)', borderLeft: '1px solid lightgray' }}>
              <Group
                id='comments-header'
                p='0.5rem'
                position='apart'
                sx={{ height: '7%', borderBottom: '1px solid lightgray' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar radius='xl' />
                  <Text weight='bold' size='sm' px='1rem' color='#262626'>
                    nickanme
                  </Text>
                </Box>
                <Box>
                  <ActionIcon variant='transparent'>
                    <MdMoreHoriz size={30} />
                  </ActionIcon>
                </Box>
              </Group>

              <Box
                id='comments'
                sx={{
                  height: '75%',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Title order={3}>No comments yet</Title>
              </Box>

              <Box id='comments-controls' sx={{ height: '18%' }}>
                <Box p='0.5rem' sx={{ borderBottom: '1px solid lightgray' }}>
                  <Group position='apart' mb='0.5rem'>
                    <Box sx={{ display: 'flex' }}>
                      <ActionIcon variant='transparent' color='dark' mr='0.5rem'>
                        <IoHeartOutline size={30} />
                      </ActionIcon>
                      <ActionIcon variant='transparent' color='dark' mx='0.5rem'>
                        <IoChatbubbleEllipsesOutline size={30} />
                      </ActionIcon>
                      <ActionIcon variant='transparent' color='dark' mx='0.5rem'>
                        <IoPaperPlaneOutline size={30} />
                      </ActionIcon>
                    </Box>
                    <Box>
                      <ActionIcon variant='transparent' color='dark' mx='0.5rem'>
                        <IoBookmarkOutline size={30} />
                      </ActionIcon>
                    </Box>
                  </Group>

                  <Box p='0.2rem'>
                    <Text weight='bold' size='sm'>
                      {post.likes} likes
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Textarea
                    variant='unstyled'
                    px='0.5rem'
                    sx={{ height: '100%' }}
                    minRows={3}
                    placeholder='Add a comment...'
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </>
  )
}

export default Post
