import { Container, Loader } from '@mantine/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMe } from '../../hooks/useMe'
import { trpc } from '../../utils/trpc'
import Toast from '../Toast'
import PostCard from './PostCard'
import Suggestions from './Suggestions'
import SuggestionsCarousel from './SuggestionsCarousel'

const Feed = () => {
  const observerElem = useRef<HTMLDivElement>(null)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const feedQuery = trpc.useInfiniteQuery(['feed.get-feed', { limit: 5 }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  const { data: s } = trpc.useQuery(['feed.get-suggestions'])
  const { me } = useMe()
  const pages = feedQuery.data?.pages
  const suggestions = s!.suggestions!

  const displayPosts = () => {
    const postsArr = pages?.map(({ feed }) =>
      feed.map((post: typeof feed[number]) => (
        <PostCard key={post.id} post={post} setIsToastVisible={setIsToastVisible} />
      ))
    )

    return postsArr
  }

  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries
      if (target.isIntersecting) {
        feedQuery.fetchNextPage()
      }
    },
    [feedQuery.fetchNextPage, feedQuery.hasNextPage]
  )

  useEffect(() => {
    const element = observerElem.current
    const option = { threshold: 0 }
    const observer = new IntersectionObserver(handleObserver, option)
    observer.observe(element as Element)
    return () => observer.unobserve(element as Element)
  }, [feedQuery.fetchNextPage, feedQuery.hasNextPage, handleObserver])

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
        {pages && displayPosts()}

        <div ref={observerElem}>
          {feedQuery.isFetching && feedQuery.hasNextPage ? (
            <Loader color='gray' size='md' sx={{ justifySelf: 'center' }} />
          ) : (
            ''
          )}
        </div>
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
