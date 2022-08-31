import { Box, Button, Center, CopyButton, Modal } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Post } from '../../types/app.types'
import { trpc } from '../../utils/trpc'

type Props = {
  isOpenModal: boolean
  setIsOpenModal: (v: boolean) => void
  post: Post
  setIsToastVisible: (v: boolean) => void
}

const PostCardModal = ({ isOpenModal, setIsOpenModal, post, setIsToastVisible }: Props) => {
  const router = useRouter()
  const { data } = useSession()
  const utils = trpc.useContext()

  const deletePost = trpc.useMutation(['post.delete-post'], {
    async onSuccess() {
      await utils.invalidateQueries('feed.get-feed')
      setIsToastVisible(true)

      setTimeout(() => {
        setIsToastVisible(false)
      }, 6000)
    },
  })

  const unfollow = trpc.useMutation(['follow.unfollow'], {
    onSuccess() {
      utils.invalidateQueries('feed.get-feed')
    },
  })

  return (
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
            <Button variant='white' fullWidth compact color='dark' onClick={() => router.push(`/p/${post.id}`)}>
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
            <Button variant='white' fullWidth compact color='red' disabled>
              Report
            </Button>
          </Center>
          <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
            <Button
              variant='white'
              fullWidth
              compact
              color='red'
              onClick={() => unfollow.mutate({ userId: post.User!.id })}>
              Unfollow
            </Button>
          </Center>
          <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
            <Button variant='white' fullWidth compact color='dark' onClick={() => router.push(`/p/${post.id}`)}>
              Go to post
            </Button>
          </Center>
          <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
            <Button variant='white' fullWidth compact color='dark' disabled>
              Share to
            </Button>
          </Center>
          <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
            <CopyButton value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${post.id}`}>
              {({ copied, copy }) => (
                <Button variant='white' fullWidth compact color='dark' onClick={copy}>
                  {copied ? 'Copied post link' : 'Copy link'}
                </Button>
              )}
            </CopyButton>
          </Center>
          <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
            <Button variant='white' fullWidth compact color='dark' disabled>
              Embed
            </Button>
          </Center>
          <Center sx={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setIsOpenModal(false)}>
            <Button variant='white' fullWidth compact color='dark'>
              Cancel
            </Button>
          </Center>
        </Box>
      )}
    </Modal>
  )
}

export default PostCardModal
