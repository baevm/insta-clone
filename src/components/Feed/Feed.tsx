import { Container } from '@mantine/core'
import { useState } from 'react'
import { useMe } from '../../hooks/useMe'
import { trpc } from '../../utils/trpc'
import Toast from '../Toast'
import PostCard from './PostCard'
import Suggestions from './Suggestions'
import SuggestionsCarousel from './SuggestionsCarousel'

const Feed = () => {
  const [isToastVisible, setIsToastVisible] = useState(false)
  const { data: f } = trpc.useQuery(['post.get-feed'])
  const { data: s } = trpc.useQuery(['post.get-suggestions'])
  const { me } = useMe()
  const feed = f!.feed!
  const suggestions = s!.suggestions!

  const displaySortedPosts = () => {
    const sortedPosts = feed
     
      .map((post: typeof feed[number]) => <PostCard key={post.id} post={post} setIsToastVisible={setIsToastVisible} />)

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
        {suggestions.length > 0 && <SuggestionsCarousel suggestions={suggestions} />}
      </Container>
      {suggestions.length > 0 && (
        <Suggestions name={me?.profile.name} avatar={me?.profile.avatar} suggestions={suggestions} />
      )}

      {isToastVisible && <Toast text='Post deleted.' />}
    </Container>
  )
}

export default Feed
