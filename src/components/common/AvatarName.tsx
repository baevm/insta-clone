import { Anchor, Avatar, Box, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'

type Props = {
  avatar?: string | null
  name?: string | null
  undername?: string | null
}

const AvatarName = ({ avatar, name, undername }: Props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link href={`/${name}`} passHref>
        <Anchor>
          <Avatar radius='xl' src={avatar ? avatar : ''} />
        </Anchor>
      </Link>
      <Box>
        <Link href={`/${name}`} passHref>
          <Anchor weight='bold' color='dark' underline={false} size='sm' px='1rem'>
            {name}
          </Anchor>
        </Link>
        {undername && (
          <Text size='xs' color='gray' px='1rem'>
            Popular
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default AvatarName
