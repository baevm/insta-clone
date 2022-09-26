import { Carousel } from '@mantine/carousel'
import { Box, Container, Skeleton, Stack, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { Post as PostProps } from '../../../types/app.types'
import { formatDate } from '../../../utils/formatDate'
import { trpc } from '../../../utils/trpc'
import SEO from '../../SEO'
import Comment from './Comment'
import CommentControls from './CommentControls'
import PostHeader from './PostHeader'

type Props = {
  postId: any
  type: 'modal' | 'standalone'
}

const Post = ({ postId, type }: Props) => {
  const { data } = useSession()
  const { data: postArr, isLoading } = trpc.useQuery(['post.get-post', { postId }])

  const post = postArr?.post || ({} as PostProps)

  
  return (
    <>
      {!isLoading && <SEO title={`Instagram photo by ${post.User?.name}`} siteName={formatDate(post.createdAt)} />}
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
          },
        }}>
        {/* Mobile header on top of image */}

        <PostHeader name={post.User?.name} avatar={post.User?.avatar} postId={post.id} type='mobile' />

        {isLoading ? (
          <Skeleton
            sx={{
              height: '880px',
              maxWidth: '850px',
              width: 'calc(100% - 40%)',

              '@media (max-width: 956px)': {
                width: '100%',
                borderBottom: '1px solid lightgray',
              },
            }}
          />
        ) : (
          <Box
            id='post-image-container'
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'black',
              justifyContent: 'center',
              maxHeight: '880px',
              maxWidth: '850px',
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
                      maxWidth: '850px',
                      width: 'calc(100% - 40%)',
                    }}>
                    <Image src={image} alt='post' width='850' height='850' quality={100} objectFit='cover' />
                  </Carousel.Slide>
                ))}
              </Carousel>
            ) : (
              <Image src={post.images[0]} alt='post' width='850' height='850' quality={100} objectFit='cover' />
            )}
          </Box>
        )}

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
          <PostHeader name={post.User?.name} avatar={post.User?.avatar} postId={post.id} type='desktop' />

          {isLoading ? (
            <Box sx={{ height: '75%' }} />
          ) : post.comments.length > 0 ? (
            <Box
              p='0.5rem'
              sx={{
                height: '75%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}>
              {post.comments &&
                post.comments.map((c: any) => (
                  <Comment
                    postId={postId}
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

          {isLoading ? (
            <Stack spacing='xs' px='1rem' py='3rem' sx={{ borderTop: '1px solid lightgray' }}>
              <Skeleton width='120px' height='10px' />
              <Skeleton width='170px' height='10px' />
              <Skeleton width='80px' height='10px' />
            </Stack>
          ) : (
            <CommentControls postId={post.id} likes={post.likedUsers} />
          )}
        </Box>
      </Container>
    </>
  )
}

export default React.memo(Post)
