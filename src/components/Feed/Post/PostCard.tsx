import { Carousel } from '@mantine/carousel'
import { ActionIcon, Box, Card, Group, Transition } from '@mantine/core'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { Post } from '../../../types/app.types'
import AvatarName from '../../common/AvatarName'
import PostCardControls from './PostCardControls'

const PostCardModal = dynamic(() => import('./PostCardModal'), { ssr: false })

type Props = {
  post: Post
}

const PostCard = ({ post }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <>
      <PostCardModal
        isOpenModal={isOpenModal}
        post={post}
        setIsOpenModal={setIsOpenModal}
      />

      <Card withBorder radius='md' p={0}>
        <Card.Section py='xs' px='xs'>
          <Group position='apart' align='center'>
            <AvatarName avatar={post.User?.avatar} name={post.User!.name} />

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
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                  }}>
                  <Image src={image} alt='post' width='600' height='550' quality={100} objectFit='cover' />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Image src={post.images[0]} alt='post' width='600' height='550' quality={100} objectFit='cover' />
          )}
        </Card.Section>
        <PostCardControls post={post} />
      </Card>
    </>
  )
}

export default PostCard
