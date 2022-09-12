import { Box, Button, Center } from '@mantine/core'
import { useRouter } from 'next/router'
import DeletePostButton from '../../common/DeletePostButton'

type Props = {
  postId: string
  setIsOpenModal: (v: boolean) => void
}

const MyPostModal = ({ postId, setIsOpenModal }: Props) => {
  const router = useRouter()

  return (
    <Box>
      <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
        <DeletePostButton postId={postId} type='feed' />
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
        <Button variant='white' fullWidth compact color='dark' onClick={() => router.push(`/p/${postId}`)}>
          Go to post
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

export default MyPostModal
