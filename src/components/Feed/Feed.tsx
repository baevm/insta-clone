import { Container } from '@mantine/core'
import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import Toast from '../Toast'
import PostCard from './PostCard'
import Suggestions from './Suggestions'
import SuggestionsCarousel from './SuggestionsCarousel'

const Feed = () => {
  const [isToastVisible, setIsToastVisible] = useState(false)
  const { data: f } = trpc.useQuery(['post.get-feed'])
  const { data: s } = trpc.useQuery(['post.get-suggestions'])
  const feed = f!.feed!
  const suggestions = s!.suggestions!

  // map authed user posts with posts of users he follows
  const displaySortedPosts = () => {
    const OtherUsersPosts = feed!.following.flatMap((f: any) => f.posts)
    const AllPosts = [...OtherUsersPosts, ...feed!.posts]

    const sortedPosts = AllPosts.sort((a: any, b: any) => -a.createdAt.localeCompare(b.createdAt)).map(
      (post: typeof feed.posts[number]) => <PostCard key={post.id} post={post} setIsToastVisible={setIsToastVisible} />
    )

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

      {isToastVisible && <Toast text='Post deleted.' />}
    </Container>
  )
}

export default Feed
