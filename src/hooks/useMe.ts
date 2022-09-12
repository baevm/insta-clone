import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { trpc } from '../utils/trpc'

// for logged in user only
export const useMe = () => {
  const { data: session, status } = useSession()
  const name = session?.user?.name

  const query = trpc.useQuery(['user.get-profile', { slug: name }], {
    enabled: status === 'authenticated',
    
    onError: (error) => {
      // name exists but not valid session, clear it
      if (name && error.data?.code === 'NOT_FOUND') {
        signOut()
      }
    },
  })

  return { me: query.data, isLoadingMe: query.isFetching || status === 'loading', status }
}
