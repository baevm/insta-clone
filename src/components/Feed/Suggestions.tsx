import { Anchor, Avatar, Box, Button, Group, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { trpc } from '../../utils/trpc'

const Suggestions = ({ name, avatar, suggestions }: any) => {
  const { data } = useSession()
  const { mutate } = trpc.useMutation('follow.follow')

  const handleFollow = (id: string) => {
    mutate({ userId: id })
  }

 

  return (
    <Box sx={{ width: '35%' }}>
      <Group position='apart'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href={`/${name}`} passHref>
            <Anchor>
              <Avatar radius='xl' size='md' src={avatar ? avatar : ''} />
            </Anchor>
          </Link>
          <Link href={`/${name}`} passHref>
            <Anchor weight='bold' ml='0.5rem' color='dark' underline={false}>
              {name}
            </Anchor>
          </Link>
        </Box>
        <Box>
          <Button variant='subtle'>Switch</Button>
        </Box>
      </Group>

      <Group position='apart'>
        <Text pl='0.5rem' color='gray' weight='bold'>
          Suggestions for you
        </Text>
        <Button variant='subtle' color='dark'>
          See all
        </Button>
      </Group>

      <Box>
        {suggestions.map((s: any) => (
          <Group position='apart' key={s.id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href={`/${s.name}`} passHref>
                <Anchor>
                  <Avatar size='md' radius='xl' src={s.avatar ? s.avatar : ''} />
                </Anchor>
              </Link>
              <Box ml='0.5rem'>
                <Link href={`/${s.name}`} passHref>
                  <Anchor weight='bold' color='dark' underline={false}>
                    {s.name}
                  </Anchor>
                </Link>
                <Text size='xs' color='gray'>
                  Popular
                </Text>
              </Box>
            </Box>

            {/*  {s.followedBy.map((f: any) =>
              f.id === data?.user.id ? (
                <Box sx={{ fontSize: '12px', paddingRight: '1rem', color: 'gray' }} key={f.id}>Followed</Box>
              ) : ( */}
            <Box>
              <Button variant='subtle' onClick={() => handleFollow(s.id)}>
                Follow
              </Button>
            </Box>
            {/*    )
            )} */}
          </Group>
        ))}
      </Box>
    </Box>
  )
}

export default React.memo(Suggestions)
