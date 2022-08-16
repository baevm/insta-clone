import { Container } from '@mantine/core'
import PostCard from './PostCard'
import Suggestions from './Suggestions'

const Feed = ({ feed, suggestions }: any) => {

  const displaySortedPosts = () => {
    const posts = feed.following.flatMap((f: any) => f.posts)

   
    const sortedPosts = posts
      .sort((a: any, b: any) => -a.createdAt.localeCompare(b.createdAt))
      .map((post: any) => <PostCard key={post.id} post={post} />)
    return sortedPosts
  }

  console.log(feed)
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


        {feed.following && displaySortedPosts()}
      </Container>
      <Suggestions name={feed.name} avatar={feed.avatar} suggestions={suggestions} />
    </Container>
  )
}

export default Feed
