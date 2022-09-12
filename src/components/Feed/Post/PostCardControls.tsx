import { Anchor, Box, Card, Divider, Group, Skeleton, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Post } from '../../../types/app.types'
import { formatDate } from '../../../utils/formatDate'
import CommentButton from '../../common/CommentButton'
import FavoriteButton from '../../common/FavoriteButton'
import LikeButton from '../../common/LikeButton'
import ShareButton from '../../common/ShareButton'
import CommentArea from './CommentArea'

type Props = {
  post: Post
}

const PostCardControls = ({ post }: Props) => {
  const { status } = useSession()

  return (
    <>
      <Card.Section py='xs' px='xs'>
        <Group position='apart'>
          {status === 'loading' ? (
            <Skeleton width='200px' height='30px' />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LikeButton likes={post.likedUsers} postId={post.id} type='feed' />
              <CommentButton />
              <ShareButton />
            </Box>
          )}

          <Box>
            <FavoriteButton />
          </Box>
        </Group>
      </Card.Section>

      <Card.Section px='xs'>
        <Box>
          <Text weight='bold' size='sm'>
            {post.likedUsers.length} likes
          </Text>
        </Box>

        <Box py='xs'>
          {post.comments.length > 0 && (
            <Box color='black' sx={{ fontSize: '14px' }}>
              <Box component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {post.comments[0].User?.name}
              </Box>{' '}
              {post.comments[0].body}
            </Box>
          )}

          <Box>
            <Text size='sm'>
              <Link href={`/p/${post.id}`} passHref>
                <Anchor underline={false} color='gray'>
                  View all comments
                </Anchor>
              </Link>
            </Text>
            <Box>
              <Text size='xs' color='gray'>
                {formatDate(post.createdAt)}
              </Text>
            </Box>
          </Box>
        </Box>
      </Card.Section>

      <Card.Section>
        <Divider />
        <CommentArea post={post} />
      </Card.Section>
    </>
  )
}

export default PostCardControls
