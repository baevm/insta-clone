import { Anchor, Avatar, Box, Button, Group, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { Suggestions } from '../../types/app.types'
import { trpc } from '../../utils/trpc'


type Props = {
  name: string | null
  avatar: string | null
  suggestions: Suggestions
}

const Suggestions = ({ name, avatar, suggestions }: Props) => {
  const { mutate } = trpc.useMutation('follow.follow')

  const handleFollow = (id: string) => {
    mutate({ userId: id })
  }

  return (
    <Box sx={{ width: '35%', '@media (max-width: 756px)': { display: 'none' } }}>
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
          <Button variant='subtle' compact>
            Switch
          </Button>
        </Box>
      </Group>

      <Group position='apart'>
        <Text pl='0.5rem' color='gray' weight='bold'>
          Suggestions for you
        </Text>
        <Button variant='subtle' compact color='dark'>
          See all
        </Button>
      </Group>

      <Box>
        {suggestions.map((s: typeof suggestions[number]) => (
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

            <Button variant='subtle' compact onClick={() => handleFollow(s.id)}>
              Follow
            </Button>
          </Group>
        ))}
      </Box>
    </Box>
  )
}

export default React.memo(Suggestions)
