import { Box, Button, Card, Container, Group, Title } from '@mantine/core'
import PostCard from './PostCard'
import Suggestions from './Suggestions'
import SuggestionsCarousel from './SuggestionsCarousel'

const Feed = ({ feed, suggestions }: any) => {
  const displaySortedPosts = () => {
    const OtherUsersPosts = feed.following.flatMap((f: any) => f.posts)
    const AllPosts = [...OtherUsersPosts, ...feed.posts]

    const sortedPosts = AllPosts.sort((a: any, b: any) => -a.createdAt.localeCompare(b.createdAt)).map((post: any) => (
      <PostCard key={post.id} post={post} />
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
    </Container>
  )
}

export default Feed
