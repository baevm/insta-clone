import { Anchor, Avatar, Box, Group, Input, Popover, Text, Title } from '@mantine/core'
import Link from 'next/link'
import React, { ChangeEvent, MutableRefObject, useRef, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { trpc } from '../../utils/trpc'
import { User } from '../../types/app.types'

const Search = () => {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false)
  const timeout: { current: NodeJS.Timeout | null } = useRef(null)
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
  const { mutate } = trpc.useMutation(['feed.search-user'], {
    onSuccess(data) {
      setSearchResult(data)
    },
  })
  const [searchResult, setSearchResult] = useState<{
    searchResult: User[]
    status?: number
    message?: string
  } | null>(null)

  const handleDebouncedSearch = (e: ChangeEvent) => {
    clearTimeout(timeout.current as NodeJS.Timeout)

    if (!inputRef.current?.value.trim()) {
      setSearchResult(null)
      return
    }

    const target = e.target as HTMLInputElement
    timeout.current = setTimeout(() => {
      mutate({ query: target.value })
    }, 600)
  }

  return (
    <Box sx={{ width: '250px', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
      <Popover width='target' radius={0} withArrow shadow='md'>
        <Popover.Target>
          <Box onFocusCapture={() => setIsPopoverOpened(true)} onBlurCapture={() => setIsPopoverOpened(false)}>
            <Input
              placeholder='Search'
              variant='filled'
              icon={<IoSearchOutline size={16} />}
              ref={inputRef}
              onChange={handleDebouncedSearch}
            />
          </Box>
        </Popover.Target>
        <Popover.Dropdown p={0} sx={{ height: '220px' }}>
          {searchResult?.searchResult?.length! > 0 ? (
            <>
              {searchResult?.searchResult?.map((user) => (
                <Group p={'0.5rem'} key={user!.id} sx={{ borderBottom: '1px solid lightgray' }}>
                  <Link href='/nickname' passHref>
                    <Anchor>
                      <Avatar src={user!.avatar} radius='xl' />
                    </Anchor>
                  </Link>
                  <Link href='/nickname' passHref>
                    <Anchor weight='bold' color='dark' underline={false} size='xs'>
                      {user!.name}
                    </Anchor>
                  </Link>
                </Group>
              ))}
            </>
          ) : (
            <Box sx={{ height: '100%' }} p='0.5rem'>
              <Title order={5}>{searchResult?.status === 404 ? 'Search' : 'Recent'}</Title>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Text color='gray'>{searchResult?.status === 404 ? 'No users found' : 'No recent searches'}</Text>
              </Box>
            </Box>
          )}
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}

export default React.memo(Search)
