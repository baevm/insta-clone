import { signOut, useSession } from 'next-auth/react'
import { trpc } from '../utils/trpc'

// for logged in user only
export const useMe = () => {
  const { data: session, status } = useSession()
  const name = session?.user?.name

  const query = trpc.useQuery(['user.get-profile', { slug: name }], {
    enabled: status !== 'loading',
    onError: (error) => {
      console.error('me query error: ', error.message)

      // name exists but not valid session, clear it
      if (name && error.data?.code === 'NOT_FOUND') {
        signOut()
      }
    },
  })

 

  return { me: query.data, isLoadingMe: !query.data, status}
}
