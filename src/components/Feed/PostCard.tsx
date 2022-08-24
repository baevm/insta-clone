import { Carousel } from '@mantine/carousel'
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Modal, Text,
  Textarea
} from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { IoBookmarkOutline, IoChatbubbleOutline, IoHeartOutline, IoPaperPlaneOutline } from 'react-icons/io5'
import { MdMoreHoriz } from 'react-icons/md'
import { User } from '../../types/app.types'
import { formatDate } from '../../utils/formatDate'
import { trpc } from '../../utils/trpc'

type Props = {
  post: {
    User: User
    id: string
    createdAt: Date
    likedUsers: User[]
    images: string[]
    comments: any
  }
  setIsToastVisible: (v: boolean) => void
}

const PostCard = ({ post, setIsToastVisible }: Props) => {
  const { data } = useSession()
  const utils = trpc.useContext()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [newComment, setNewComment] = useState('')

  const deletePost = trpc.useMutation(['post.delete-post'], {
    async onSuccess() {
      await utils.invalidateQueries('post.get-feed')
      setIsToastVisible(true)

      setTimeout(() => {
        setIsToastVisible(false)
      }, 6000)
    },
  })

  const addComment = trpc.useMutation(['post.add-comment'])
  return (
    <>
      <Modal
        opened={isOpenModal}
        centered
        size='sm'
        onClose={() => setIsOpenModal(false)}
        withCloseButton={false}
        padding={0}
        zIndex={2000}
        styles={(theme) => ({
          modal: {
            borderRadius: '10px',
          },
        })}>
        {data?.user.id === post.User?.id ? (
          <Box>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
              <Button variant='white' fullWidth compact color='red' onClick={() => deletePost.mutate({ id: post.id })}>
                Delete
              </Button>
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
              <Button variant='white' fullWidth compact color='dark' disabled>
                Edit
              </Button>
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
              <Button variant='white' fullWidth compact color='dark' disabled>
                Hide like count
              </Button>
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
              <Button variant='white' fullWidth compact color='dark' disabled>
                Turn off commenting
              </Button>
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
              <Button variant='white' fullWidth compact color='dark' disabled>
                Go to post
              </Button>
            </Center>
            <Center sx={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setIsOpenModal(false)}>
              <Button variant='white' fullWidth compact color='dark'>
                Cancel
              </Button>
            </Center>
          </Box>
        ) : (
          <Box>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
              Report
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
              Unfollow
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
              Go to post
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Share to</Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
              Copy link
            </Center>
            <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Embed</Center>
            <Center sx={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setIsOpenModal(false)}>
              Cancel
            </Center>
          </Box>
        )}
      </Modal>

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

        <Card.Section py='xs' px='xs'>
          <Group position='apart'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
                <IoHeartOutline size='1.8rem' />
              </ActionIcon>
              <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
                <IoChatbubbleOutline size='1.5rem' />
              </ActionIcon>
              <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
                <IoPaperPlaneOutline size='1.5rem' />
              </ActionIcon>
            </Box>
            <Box>
              <ActionIcon color='dark' variant='transparent' size='md' mr='xs'>
                <IoBookmarkOutline size='1.5rem' />
              </ActionIcon>
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
          <Textarea
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Add a comment'
            styles={(theme) => ({
              input: {
                border: '0px solid black',
              },
            })}
          />
        </Card.Section>
      </Card>
    </>
  )
}

export default PostCard
