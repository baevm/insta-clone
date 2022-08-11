import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Input,
  Modal,
  Text,
  Textarea,
} from '@mantine/core'
import React, { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { IoHeartOutline, IoChatbubbleOutline, IoPaperPlaneOutline, IoBookmarkOutline } from 'react-icons/io5'

const PostCard = ({ post }: any) => {
  const [showMore, setShowMore] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <>
      <Modal
        opened={isOpenModal}
        centered
        size='sm'
        onClose={() => setIsOpenModal(false)}
        withCloseButton={false}
        padding={0}
        styles={(theme) => ({
          modal: {
            borderRadius: '10px',
          },
        })}>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
          Report
        </Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
          Unfollow
        </Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Go to post</Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Share to</Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Copy link</Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>Embed</Center>
        <Center sx={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setIsOpenModal(false)}>
          Cancel
        </Center>
      </Modal>

      <Card withBorder radius='md'>
        <Card.Section py='xs' px='xs'>
          <Group position='apart' align='center'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar radius='xl' />
              <Text pl='0.5rem' weight='bold' size='sm'>
                {post.poster}
              </Text>
            </Box>
            <ActionIcon color='dark' variant='transparent' size='md' onClick={() => setIsOpenModal(true)}>
              <MdMoreHoriz size='1.8rem' />
            </ActionIcon>
          </Group>
        </Card.Section>

        <Card.Section>
          <Image src={post.image} alt='post' />
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
              {post.likes} likes
            </Text>
          </Box>

          <Box py='xs'>
            <Box component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
              {post.poster}
            </Box>{' '}
            <Box component='span' sx={{ fontSize: '14px' }}>
              {showMore ? post.caption : post.caption.substring(0, 90) + '...'}
            </Box>
            {!showMore && (
              <Button variant='subtle' onClick={() => setShowMore(!showMore)} color='dark'>
                Show more
              </Button>
            )}
            <Box>
              <Text size='sm' color='gray'>
                View all comments
              </Text>
              <Box>
                <Box component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                  RandomDude1
                </Box>{' '}
                <Box component='span' sx={{ fontSize: '14px' }}>
                  Comment from another user
                </Box>
              </Box>
              <Box>
                <Text size='xs' color='gray'>
                  May 17
                </Text>
              </Box>
            </Box>
          </Box>
        </Card.Section>

        <Card.Section>
          <Divider />
          <Textarea
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
