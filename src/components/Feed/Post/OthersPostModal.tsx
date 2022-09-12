import { Box, Button, Center, CopyButton } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from '../../../utils/trpc'

type Props = {
  userId: string
  postId: string
  setIsOpenModal: (v: boolean) => void
}

const OthersPostModal = ({ setIsOpenModal, userId, postId }: Props) => {
  const router = useRouter()
  const utils = trpc.useContext()
  const unfollow = trpc.useMutation(['follow.unfollow'], {
    onSuccess() {
      utils.invalidateQueries('feed.get-feed')
    },
  })
  return (
    <Box>
      <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
        <Button variant='white' fullWidth compact color='red' disabled>
          Report
        </Button>
      </Center>
      <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red', cursor: 'pointer' }}>
        <Button variant='white' fullWidth compact color='red' onClick={() => unfollow.mutate({ userId })}>
          Unfollow
        </Button>
      </Center>
      <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
        <Button variant='white' fullWidth compact color='dark' onClick={() => router.push(`/p/${postId}`)}>
          Go to post
        </Button>
      </Center>
      <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
        <Button variant='white' fullWidth compact color='dark' disabled>
          Share to
        </Button>
      </Center>
      <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', cursor: 'pointer' }}>
        <CopyButton value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${postId}`}>
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
  )
}

export default OthersPostModal
