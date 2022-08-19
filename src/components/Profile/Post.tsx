import { Carousel } from '@mantine/carousel'
import {
  ActionIcon,
  AspectRatio,
  Avatar,
  Box,
  Container,
  Grid,
  Group,
  Image,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import NextImage from 'next/image'
import { useRef, useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleEllipsesOutline, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { MdMoreHoriz } from 'react-icons/md'
import { getTimeAgo } from '../../utils/formatDate'
import { useDisableBodyScroll } from '../../utils/useDisableBodyScroll'
import { useOutsideClick } from '../../utils/useOutsideClick'

const Post = ({ post, username, avatar }: any) => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useDisableBodyScroll(isModalOpened)
  useOutsideClick(modalRef, () => setIsModalOpened(false))

  return (
    <>
      <Grid.Col span={4} onClick={() => setIsModalOpened(true)} sx={{ cursor: 'pointer' }}>
        <NextImage
          src={post.images[0]}
          alt='post'
          width='100%'
          height='100%'
          layout='responsive'
          objectFit='cover'
          quality={100}
          style={{ backgroundColor: 'black' }}
        />
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
              width: '90%',
              height: '90%',
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              display: 'flex',
              flexDirection: 'row',
            }}
            ref={modalRef}>
            <Box sx={{ maxWidth: '80rem', width: '100%', display: 'flex', alignItems: 'center', backgroundColor: 'black' }}>
              {post.images.length > 1 ? (
                <Carousel
                  slideSize='100%'
                  height='100%'
                  slideGap='md'
                  styles={{
                    control: {
                      '&[data-inactive]': {
                        opacity: 0,
                        cursor: 'default',
                      },
                    },
                  }}>
                  {post.images.map((image: string, index: number) => (
                    <Carousel.Slide
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image src={image} alt='post' width='850' />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                
                  <Image src={post.images} alt='post' width='100%' />
              )}
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
                  <Avatar radius='xl' src={avatar} />
                  <Text weight='bold' size='sm' px='1rem' color='#262626'>
                    {username}
                  </Text>
                </Box>
                <Box>
                  <ActionIcon variant='transparent'>
                    <MdMoreHoriz size={30} />
                  </ActionIcon>
                </Box>
              </Group>

              {post.caption ? (
                <Box
                  p='0.5rem'
                  sx={{
                    height: '75%',
                    display: 'flex',
                  }}>
                  <Avatar src={avatar} mr='0.5rem' radius='xl' alt='avatar' />
                  <Box>
                    <Box py='0.2rem' color='black' sx={{ fontSize: '14px' }}>
                      <Box component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {username}
                      </Box>{' '}
                      {post.caption}
                    </Box>

                    <Text size='xs' color='gray'>
                      {getTimeAgo(post.createdAt)}
                    </Text>
                  </Box>
                </Box>
              ) : (
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
              )}

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
