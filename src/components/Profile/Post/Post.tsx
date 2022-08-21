import { Carousel } from '@mantine/carousel'
import { Anchor, Box, Container, Grid, Image, Modal, Title } from '@mantine/core'
import NextImage from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { trpc } from '../../../utils/trpc'
import Comment from './Comment'
import CommentControls from './CommentControls'
import PostHeader from './PostHeader'

const Post = ({ post, username, avatar, setIsToastVisible }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // both links should have "shallow" parameter to prevent GSSP call on open/close modal
  return (
    <>
      <Grid.Col span={4} sx={{ cursor: 'pointer' }}>
        <Link href={`/[profile]?profile=${username}`} as={`/p/${post.id}`} passHref shallow>
          <Anchor>
            <NextImage
              src={post.images[0]}
              alt='post'
              width='100%'
              height='100%'
              layout='responsive'
              objectFit='cover'
              quality={85}
              style={{ backgroundColor: 'black' }}
            />
          </Anchor>
        </Link>
      </Grid.Col>

      <Modal
        opened={router.asPath === `/p/${post.id}`}
        onClose={() => router.push(`/${username}`, undefined, { shallow: true })}
        centered
        withCloseButton={false}
        size='70%'
        padding={0}
        zIndex={2000}>
        <Container
          size='xl'
          p={0}
          sx={{
            backgroundColor: 'white',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',

            '@media (max-width: 956px)': {
              flexDirection: 'column',
              overflowY: 'scroll',
            },
          }}
          ref={modalRef}>
          <PostHeader
            username={username}
            avatar={avatar}
            postId={post.id}
            setIsToastVisible={setIsToastVisible}
            type='mobile'
          />

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
            <PostHeader
              username={username}
              avatar={avatar}
              postId={post.id}
              setIsToastVisible={setIsToastVisible}
              type='desktop'
            />

            {post.caption || post.comments.length > 0 ? (
              <Box
                p='0.5rem'
                sx={{
                  height: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                {post.caption && <Comment avatar={avatar} date={post.createdAt} name={username} text={post.caption} />}

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
      </Modal>
    </>
  )
}

export default React.memo(Post)
