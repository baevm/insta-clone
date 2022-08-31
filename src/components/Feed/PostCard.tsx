import { Carousel } from '@mantine/carousel'
import { ActionIcon, Anchor, Avatar, Box, Card, Group, Image } from '@mantine/core'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { Post } from '../../types/app.types'
import PostCardControls from './PostCardControls'

const PostCardModal = dynamic(() => import('./PostCardModal'), { ssr: false })

type Props = {
  post: Post
  setIsToastVisible: (v: boolean) => void
}

const PostCard = ({ post, setIsToastVisible }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <>
      <PostCardModal
        isOpenModal={isOpenModal}
        post={post}
        setIsOpenModal={setIsOpenModal}
        setIsToastVisible={setIsToastVisible}
      />

      <Card withBorder radius='md'>
        <Card.Section py='xs' px='xs'>
          <Group position='apart' align='center'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href={`/${post.User?.name}`} passHref>
                <Anchor>
                  <Avatar radius='xl' src={post.User?.avatar ? post.User.avatar : ''} />
                </Anchor>
              </Link>
              <Link href={`/${post.User?.name}`} passHref>
                <Anchor pl='0.5rem' weight='bold' size='sm' color='dark' underline={false}>
                  {post.User?.name}
                </Anchor>
              </Link>
            </Box>
            <ActionIcon color='dark' variant='transparent' size='md' onClick={() => setIsOpenModal(true)}>
              <MdMoreHoriz size='1.8rem' />
            </ActionIcon>
          </Group>
        </Card.Section>

        <Card.Section>
          {post.images.length > 1 ? (
            <Carousel
              styles={{
                control: {
                  '&[data-inactive]': {
                    opacity: 0,
                    cursor: 'default',
                  },
                },
              }}>
              {post.images.map((image: any) => (
                <Carousel.Slide
                  key={image}
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                  <Image src={image} alt='post' />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Image src={post.images[0]} alt='post' />
          )}
        </Card.Section>

        <PostCardControls post={post} />
      </Card>
    </>
  )
}

export default PostCard
