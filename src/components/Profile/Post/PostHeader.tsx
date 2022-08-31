import { ActionIcon, Box, Button, Center, Group, Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MdClose, MdMoreHoriz } from 'react-icons/md'
import { trpc } from '../../../utils/trpc'
import AvatarName from '../../common/AvatarName'

type Props = {
  name: string
  avatar: string
  type: 'mobile' | 'desktop'
  setIsToastVisible: any
  postId: string
}

const PostHeader = ({ name, avatar, type, setIsToastVisible, postId }: Props) => {
  const mobileQuery = useMediaQuery('(max-width: 768px)', true)
  const router = useRouter()
  const { data } = useSession()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const utils = trpc.useContext()

  const deletePost = trpc.useMutation(['post.delete-post'], {
    async onSuccess() {
      await utils.invalidateQueries('user.get-profile')
      router.push(`/${name}`)
      setIsToastVisible(true)

      setTimeout(() => {
        setIsToastVisible(false)
      }, 6000)
    },
  })

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
          /* '@media (max-width: 956px)': { display: type === 'desktop' ? 'none' : '' }, */
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
        styles={(theme) => ({
          modal: {
            borderRadius: '10px',
          },
        })}>
        <Center sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem', color: 'red' }}>
          <Button variant='white' fullWidth compact color='red' onClick={() => deletePost.mutate({ id: postId })}>
            Delete
          </Button>
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
