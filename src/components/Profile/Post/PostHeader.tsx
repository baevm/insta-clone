import { ActionIcon, Box, Button, Center, Group, Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MdClose, MdMoreHoriz } from 'react-icons/md'
import AvatarName from '../../common/AvatarName'
import DeletePostButton from '../../common/DeletePostButton'

type Props = {
  name: string | null | undefined
  avatar: string | null | undefined
  type: 'mobile' | 'desktop'
  postId: string
}

const PostHeader = ({ name, avatar, type, postId }: Props) => {
  const mobileQuery = useMediaQuery('(max-width: 768px)', true)
  const router = useRouter()
  const { data } = useSession()
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <>
      <Group
        id='comments-header'
        p='0.5rem'
        position='apart'
        sx={{
          minHeight: '7%',
          borderBottom: '1px solid lightgray',
          '@media (min-width: 956px)': { display: type === 'mobile' ? 'none' : '' },
          '@media (max-width: 956px)': { display: type === 'desktop' ? 'none' : '' },
        }}>
        <AvatarName avatar={avatar} name={name} />
        <Group align='center'>
          <Box>
            {data?.user.name === name ? (
              <ActionIcon variant='transparent' onClick={() => setIsOpenModal(true)}>
                <MdMoreHoriz size={30} />
              </ActionIcon>
            ) : (
              <div></div>
            )}
          </Box>
          {mobileQuery && (
            <Box>
              <ActionIcon onClick={() => router.push(`/${name}`, undefined, { shallow: true })}>
                <MdClose size={30} />
              </ActionIcon>
            </Box>
          )}
        </Group>
      </Group>

      <Modal
        opened={isOpenModal}
        centered
        size='sm'
        onClose={() => setIsOpenModal(false)}
        withCloseButton={false}
        padding={0}
        zIndex={3000}
        styles={() => ({
          modal: {
            borderRadius: '10px',
          },
        })}>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red' }}>
          <DeletePostButton postId={postId} type='profile' name={name}/>
        </Center>

        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
          <Button variant='white' fullWidth compact disabled>
            Share to
          </Button>
        </Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
          <Button variant='white' fullWidth compact disabled>
            Copy link
          </Button>
        </Center>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
          <Button variant='white' fullWidth compact disabled>
            Embed
          </Button>
        </Center>
        <Center sx={{ padding: '0.5rem' }}>
          <Button
            variant='white'
            fullWidth
            compact
            color='dark'
            onClick={() => {
              setIsOpenModal(false)
            }}>
            Cancel
          </Button>
        </Center>
      </Modal>
    </>
  )
}

export default PostHeader
