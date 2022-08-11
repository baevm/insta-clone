import { Container } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React from 'react'
import PostCard from './Card/PostCard'

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

const MainContent = () => {
  const matches = useMediaQuery('(min-width: 768px)', false)

  return (
    <Container fluid px={0} sx={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#FAFAFA' }}>
      <Container fluid={matches ? false : true} px={0}>
        <Container
          py='2rem'
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
      </Container>
    </Container>
  )
}

export default MainContent
