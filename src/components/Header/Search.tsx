import { Box, Input, Popover, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

const Search = () => {
  const matches = useMediaQuery('(min-width: 768px)', false)
  const [isPopoverOpened, setIsPopoverOpened] = useState(false)

  return (
    <Box sx={{ width: '250px', display: matches ? 'block' : 'none' }}>
      <Popover width='target' withArrow shadow='md'>
        <Popover.Target>
          <div onFocusCapture={() => setIsPopoverOpened(true)} onBlurCapture={() => setIsPopoverOpened(false)}>
            <Input placeholder='Search' variant='filled' icon={<IoSearchOutline size={16} />} />
          </div>
        </Popover.Target>
        <Popover.Dropdown sx={{ height: '200px' }}>
          <Title order={5}>Recent</Title>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Text color='gray'>No recent searches</Text>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}

export default React.memo(Search)
