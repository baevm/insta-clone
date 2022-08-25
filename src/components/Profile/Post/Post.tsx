import { Carousel } from '@mantine/carousel'
import { Box, Container, Image, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'
import Comment from './Comment'
import CommentControls from './CommentControls'
import PostHeader from './PostHeader'

type Props = {
  post: any
  name: string
  avatar: string
  setIsToastVisible: (v: boolean) => void
  type: 'modal' | 'standalone'
}

const Post = ({ post, name, avatar, setIsToastVisible, type }: Props) => {
  const { data } = useSession()

  return (
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
        height: type === 'modal' ? '100%' : 'calc(100vh - 60px)',
        borderRight: type === 'standalone' ? '1px solid lightgray' : '',
        borderLeft: type === 'standalone' ? '1px solid lightgray' : '',

        '@media (max-width: 956px)': {
          flexDirection: 'column',
          overflowY: 'scroll',
        },
      }}>
      {/* Mobile header on top of image */}
      <PostHeader name={name} avatar={avatar} postId={post.id} setIsToastVisible={setIsToastVisible} type='mobile' />

      <Box
        id='post-image-container'
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'black',
          justifyContent: 'center',
          maxHeight: '880px',
          maxWidth: '800px',
          width: 'calc(100% - 40%)',

          '@media (max-width: 956px)': {
            width: '100%',
            borderBottom: '1px solid lightgray',
          },
        }}>
        {post.images.length > 1 ? (
          <Carousel
            slideSize='100%'
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
                  maxHeight: '880px',
                  maxWidth: '800px',
                  width: 'calc(100% - 40%)',
                }}>
                <img src={image} alt='post' style={{ width: '100%', height: '100%' }}/>
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <img src={post.images} alt='post' style={{ width: '100%', height: '100%' }} />
        )}
      </Box>

      <Box
        id='comments-section'
        sx={{
          minHeight: '90vh',
          minWidth: '40%',
          width: '150px',
          borderLeft: '1px solid lightgray',

          '@media (max-width: 956px)': {
            width: '100%',
          },
        }}>
        {/* Desktop header on top of comments section */}
        <PostHeader name={name} avatar={avatar} postId={post.id} setIsToastVisible={setIsToastVisible} type='desktop' />

        {post.comments.length > 0 ? (
          <Box
            p='0.5rem'
            sx={{
              height: '75%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            {post.comments &&
              post.comments.map((c: any) => (
                <Comment
                  commentId={c.id}
                  avatar={c.User.avatar}
                  date={c.createdAt}
                  name={c.User.name}
                  authUserName={data?.user.name}
                  text={c.body}
                  key={c.id}
                />
              ))}
          </Box>
        ) : (
          <Box
            id='no-comments'
            sx={{
              height: '650px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Title order={3}>No comments yet</Title>
          </Box>
        )}

        <CommentControls postId={post.id} likes={post.likedUsers} />
      </Box>
    </Container>
  )
}

export default Post
