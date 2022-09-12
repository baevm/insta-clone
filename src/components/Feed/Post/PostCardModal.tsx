import { Modal } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { Post } from '../../../types/app.types'
import MyPostModal from './MyPostModal'
import OthersPostModal from './OthersPostModal'

type Props = {
  isOpenModal: boolean
  setIsOpenModal: (v: boolean) => void
  post: Post
}

const PostCardModal = ({ isOpenModal, setIsOpenModal, post }: Props) => {
  const { data } = useSession()

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
        <MyPostModal postId={post.id} setIsOpenModal={setIsOpenModal} />
      ) : (
        <OthersPostModal postId={post.id} userId={post.User!.id} setIsOpenModal={setIsOpenModal} />
      )}
    </Modal>
  )
}

export default PostCardModal
