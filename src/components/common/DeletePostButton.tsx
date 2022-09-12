import { Button } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import useInterfaceStore from '../../store/InterfaceStore'
import { trpc } from '../../utils/trpc'

type Props = {
  postId: string
  type: 'profile' | 'feed'
  name?: string | null
}

const DeletePostButton = ({ postId, type, name }: Props) => {
  const utils = trpc.useContext()
  const router = useRouter()
  const openToast = useInterfaceStore((state: any) => state.openToast)
  const closeToast = useInterfaceStore((state: any) => state.closeToast)

  const deletePost = trpc.useMutation(['post.delete-post'], {
    async onSuccess() {
      if (type === 'profile') {
        await utils.invalidateQueries('user.get-profile')
        router.push(`/${name}`, undefined, { shallow: true })
      } else if (type === 'feed') {
        await utils.invalidateQueries('feed.get-feed')
      }

      openToast({ message: 'Post deleted.' })

      setTimeout(() => {
        closeToast()
      }, 6000)
    },
  })

  return (
    <Button
      variant='white'
      fullWidth
      compact
      color='red'
      loading={deletePost.isLoading}
      onClick={() => deletePost.mutate({ id: postId })}>
      Delete
    </Button>
  )
}

export default DeletePostButton
