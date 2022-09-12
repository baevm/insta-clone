import { Anchor, Box, Grid, Indicator, Modal, Text } from '@mantine/core'
import NextImage from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { IoIosPhotos } from 'react-icons/io'
import Post from './Post'
import { IoChatbubbleSharp, IoHeart } from 'react-icons/io5'
import { useMediaQuery } from '@mantine/hooks'
import { Post as PostProps } from '../../../types/app.types'


type Props = {
  post: PostProps
  name: string
}

const PostContainer = ({ post, name }: Props) => {
  const mobileQuery = useMediaQuery('(max-width: 768px)', true)
  const [isHover, setIsHover] = useState(false)
  const router = useRouter()


  // both links should have "shallow" parameter to prevent GSSP call on open/close modal
  return (
    <>
      <Grid.Col span={4} sx={{ cursor: 'pointer' }}>
        <Link href={`/[profile]?profile=${name}`} as={`/p/${post.id}`} passHref shallow={true}>
          <Anchor onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <Indicator
              size={18}
              offset={20}
              label={post.images.length > 1 ? <IoIosPhotos size={18} color='white' /> : ''}>
              <NextImage
                src={post.images[0]}
                alt='post'
                width='100%'
                height='100%'
                layout='responsive'
                objectFit='cover'
                quality={85}
                style={{
                  backgroundColor: 'black',
                  filter: isHover ? 'brightness(60%)' : '',
                  transition: '.2s ease',
                }}
              />
              <Box
                id='hover-stats'
                sx={{
                  transition: '.2s ease',
                  opacity: isHover ? 1 : 0,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  '-ms-transform': 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.3rem',
                }}>
                <Box mr='2rem' sx={{ display: 'flex', alignItems: 'center' }}>
                  <IoHeart />
                  <Text component='span' ml='0.5rem'>
                    {post.likedUsers.length}
                  </Text>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IoChatbubbleSharp />
                  <Text component='span' ml='0.5rem'>
                    {post.comments.length}
                  </Text>
                </Box>
              </Box>
            </Indicator>
          </Anchor>
        </Link>
      </Grid.Col>

      {/* Opened post modal */}
      <Modal
        opened={router.asPath === `/p/${post.id}`}
        onClose={() => router.push(`/${name}`, undefined, { shallow: true })}
        centered
        withCloseButton={false}
        fullScreen={mobileQuery}
        padding={0}
        size='70%'
        zIndex={2000}>
        <Post type='modal' postId={post.id} />
      </Modal>
    </>
  )
}

export default React.memo(PostContainer)
