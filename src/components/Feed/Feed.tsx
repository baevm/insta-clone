import { Container } from '@mantine/core'
import PostCard from '../Card/PostCard'
import Suggestions from './Suggestions'

const posts = [
  {
    id: 1,
    poster: 'Account1',
    caption:
      'Test caption. Testing veryvery loooooong caption so it fits inside a card without overflowing.Test caption. Testing veryvery loooooong caption so it fits inside a card without overflowing......',
    image:
      'https://res.cloudinary.com/dgeksii7s/image/upload/v1660050512/react-upload/298302482_400294935529537_8214724098189740147_n.jpg_btuvu0.webp',
    likes: 425,
    date: '2020-01-01',
  },
  {
    id: 2,
    caption: 'Test caption. Testing veryvery loooooong caption so it fits inside a card without overflowing......',
    image: 'https://res.cloudinary.com/dgeksii7s/image/upload/v1660031079/react-upload/y69byiukjrk34rrhvbua.png',
    likes: 425,
    date: '2020-01-01',
  },
  {
    id: 3,
    caption: 'Test caption. Testing veryvery loooooong caption so it fits inside a card without overflowing......',
    image: 'https://res.cloudinary.com/dgeksii7s/image/upload/v1660031079/react-upload/y69byiukjrk34rrhvbua.png',
    likes: 425,
    date: '2020-01-01',
  },
]

const Feed = () => {
  return (
    <Container fluid px={0} sx={{ paddingTop: '60px', minHeight: 'calc(100vh - 60px)', backgroundColor: '#FAFAFA' }}>
      <Container
        id='text'
        px={0}
        py='2rem'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexDirection: 'column',

          '@media (min-width: 768px)': {
            flexDirection: 'row',
          },
        }}>
        <Container
          px={0}
          sx={{
            width: '100%',
            maxWidth: '480px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}>
          {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
        </Container>
        <Suggestions />
      </Container>
    </Container>
  )
}

export default Feed
