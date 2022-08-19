import { Carousel } from '@mantine/carousel'
import { ActionIcon, Box, Button, Container, Grid, Group, Image, Text, Textarea, Title } from '@mantine/core'
import NextImage from 'next/image'
import React, { useRef, useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleEllipsesOutline, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { trpc } from '../../../utils/trpc'
import { useDisableBodyScroll } from '../../../utils/useDisableBodyScroll'
import { useOutsideClick } from '../../../utils/useOutsideClick'
import Comment from './Comment'
import CommentControls from './CommentControls'
import PostHeader from './PostHeader'

const Post = ({ post, username, avatar, userId }: any) => {
  const [isPostOpened, setIsPostOpened] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useDisableBodyScroll(isPostOpened)
  useOutsideClick(modalRef, () => setIsPostOpened(false))

  return (
    <>
      <Grid.Col span={4} onClick={() => setIsPostOpened(true)} sx={{ cursor: 'pointer' }}>
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

      {isPostOpened && (
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
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              display: 'flex',
              flexDirection: 'row',
              width: '90vw',
              height: '90vh',

              '@media (max-width: 956px)': {
                flexDirection: 'column',
                overflowY: 'scroll',
              },
            }}
            ref={modalRef}>
            <PostHeader username={username} avatar={avatar} type='mobile' />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'black',
                justifyContent: 'center',
                width: 'clamp(15rem, 100%, 800px)',
                height: 'clamp(15rem, 100%)',

                '@media (max-width: 956px)': {
                  borderBottom: '1px solid lightgray',
                },
              }}>
              {post.images.length > 1 ? (
                <Carousel
                  slideSize='100%'
                  height='100%'
                  slideGap='md'
                  align='center'
                  sx={{ flex: 1 }}
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
                      <Image src={image} alt='post' />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Image src={post.images} alt='post' />
              )}
            </Box>

            <Box
              id='comments-section'
              sx={{
                minHeight: '90vh',
                minWidth: '400px',
                width: 'calc(100% - 800px)',
                borderLeft: '1px solid lightgray',

                '@media (max-width: 956px)': {
                  width: '100%',
                },
              }}>
              <PostHeader username={username} avatar={avatar} type='desktop' />

              {post.caption || post.comments ? (
                <Box
                  p='0.5rem'
                  sx={{
                    height: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  {post.caption && (
                    <Comment avatar={avatar} date={post.createdAt} name={username} text={post.caption} />
                  )}

                  {post.comments &&
                    post.comments.map((c: any) => (
                      <Comment avatar={c.User.avatar} date={c.createdAt} name={c.User.name} text={c.body} key={c.id} />
                    ))}
                </Box>
              ) : (
                <Box
                  id='no-comments'
                  sx={{
                    minHeight: '75%',
                    borderBottom: '1px solid lightgray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Title order={3}>No comments yet</Title>
                </Box>
              )}

              <CommentControls postId={post.id} likes={post.likes} />
            </Box>
          </Container>
        </Box>
      )}
    </>
  )
}

export default React.memo(Post)
