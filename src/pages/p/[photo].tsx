import { Carousel } from '@mantine/carousel'
import { Box, Container, Image, Title } from '@mantine/core'
import Comment from '../../components/Profile/Post/Comment'
import CommentControls from '../../components/Profile/Post/CommentControls'
import PostHeader from '../../components/Profile/Post/PostHeader'
import prisma from '../../utils/prisma'

const PhotoPage = ({ post }) => {
  console.log(post)

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
        height: 'calc(100vh - 60px)',
        borderRight: '1px solid lightgray',
        borderLeft: '1px solid lightgray',

        '@media (max-width: 956px)': {
          flexDirection: 'column',
          overflowY: 'scroll',
        },
      }}>
      {/* Mobile header on top of image */}
      <PostHeader username={post.User.name} avatar={post.User.avatar} type='mobile' />

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
        {/* Desktop header on top of comments section */}
        <PostHeader username={post.User.name} avatar={post.User.avatar} type='desktop' />

        {/* Caption rendered separately cause it always should be on top */}
        {post.caption || post.comments.length > 0 ? (
          <Box
            p='0.5rem'
            sx={{
              height: '75%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            {post.caption && (
              <Comment avatar={post.User.avatar} date={post.createdAt} name={post.User.name} text={post.caption} />
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
  )
}

export default PhotoPage

export const getServerSideProps = async (ctx: any) => {
  const post = await prisma.post.findUnique({
    where: {
      id: ctx.query.photo,
    },

    include: {
      User: {
        select: {
          name: true,
          avatar: true,
          id: true,
        },
      },
      comments: {
        include: {
          User: true,
        },
      },
    },
  })

  return { props: { post: JSON.parse(JSON.stringify(post)) } }
}
