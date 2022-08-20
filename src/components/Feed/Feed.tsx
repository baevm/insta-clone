import { Box, Container } from '@mantine/core'
import { useState } from 'react'
import PostCard from './PostCard'
import Suggestions from './Suggestions'
import SuggestionsCarousel from './SuggestionsCarousel'

const Feed = ({ feed, suggestions }: any) => {
  const [isToastVisible, setIsToastVisible] = useState(false)

  // map authed user posts with posts of users he follows
  const displaySortedPosts = () => {
    const OtherUsersPosts = feed.following.flatMap((f: any) => f.posts)
    const AllPosts = [...OtherUsersPosts, ...feed.posts]

    const sortedPosts = AllPosts.sort((a: any, b: any) => -a.createdAt.localeCompare(b.createdAt)).map((post: any) => (
      <PostCard key={post.id} post={post} setIsToastVisible={setIsToastVisible} isToastVisible={isToastVisible} />
    ))

    return sortedPosts
  }

  return (
    <Container
      px={0}
      py='2rem'
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
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
        {feed && displaySortedPosts()}
        <SuggestionsCarousel suggestions={suggestions} />
      </Container>
      {feed && <Suggestions name={feed.name} avatar={feed.avatar} suggestions={suggestions} />}

      {isToastVisible && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            backgroundColor: '#262626',
            color: 'white',
            padding: '0.5rem',
            minWidth: '100vw',
            fontSize: '14px',
            transition: 'transform .6s ease-in-out',
            animation: 'toast-in-top .7s',

            '@keyframes toast-in-top': {
              from: {
                transform: 'translateY(100%)',
              },
              to: {
                transform: 'translateY(0)',
              },
            },
          }}>
          Post deleted.
        </Box>
      )}
    </Container>
  )
}

export default Feed
