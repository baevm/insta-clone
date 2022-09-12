import { Box, Group, Input, Popover, Text, Title } from '@mantine/core'
import React, { ChangeEvent, MutableRefObject, useRef, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { User } from '../../types/app.types'
import { trpc } from '../../utils/trpc'
import AvatarName from '../common/AvatarName'

const Search = () => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isPopoverOpened, setIsPopoverOpened] = useState(false)
  const timeout: { current: NodeJS.Timeout | null } = useRef(null)
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
  const [searchResult, setSearchResult] = useState<{
    searchResult: User[]
    status?: number
    message?: string
  } | null>(null)
  useOutsideClick(popoverRef, () => setIsPopoverOpened(false))

  const { mutate } = trpc.useMutation(['feed.search-user'], {
    onSuccess(data) {
      setSearchResult(data)
    },
  })

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
    <Box sx={{ width: '250px', display: 'none', '@media (min-width: 768px)': { display: 'block' } }} ref={popoverRef}>
      <Popover width='target' radius={0} withArrow shadow='md' opened={isPopoverOpened}>
        <Popover.Target>
          <Box onFocus={() => setIsPopoverOpened(true)}>
            <Input
              placeholder='Search'
              variant='filled'
              icon={<IoSearchOutline size={16} />}
              ref={inputRef}
              onChange={handleDebouncedSearch}
            />
          </Box>
        </Popover.Target>
        <Popover.Dropdown p={0} sx={{ height: '222px', overflowY: 'auto' }}>
          {searchResult?.searchResult?.length! > 0 ? (
            searchResult?.searchResult?.map((user) => (
              <Group p={'0.5rem'} key={user!.id} sx={{ borderBottom: '1px solid lightgray' }}>
                <AvatarName avatar={user?.avatar} name={user?.name} />
              </Group>
            ))
          ) : (
            <Box sx={{ height: '90%' }} p='0.5rem'>
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
