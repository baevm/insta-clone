import { Anchor, Avatar, Box, Skeleton, Stack, Text } from '@mantine/core'
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
          {avatar ? (
            <Avatar radius='xl' src={avatar === '0' ? null : avatar} />
          ) : (
            <Skeleton width='30px' height='30px' radius='xl' />
          )}
        </Anchor>
      </Link>
      {name ? (
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
      ) : (
        <Stack spacing='xs'>
          <Skeleton mx='1rem' width='80px' height='10px' />
          <Skeleton mx='1rem' width='40px' height='10px' />
        </Stack>
      )}
    </Box>
  )
}

export default AvatarName
