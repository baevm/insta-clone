import { Box, Button, Group, Text } from '@mantine/core'
import React from 'react'
import { Suggestions } from '../../types/app.types'
import { trpc } from '../../utils/trpc'
import AvatarName from '../common/AvatarName'

type Props = {
  name: string | null
  avatar: string | null
  suggestions: Suggestions
}

const Suggestions = ({ name, avatar, suggestions }: Props) => {
  const utils = trpc.useContext()
  const { mutate } = trpc.useMutation('follow.follow', {
    onSuccess() {
      utils.invalidateQueries('feed.get-feed')
      utils.invalidateQueries('feed.get-suggestions')
    },
  })

  const handleFollow = (id: string) => {
    mutate({ userId: id })
  }

  return (
    <Box sx={{ width: '35%', '@media (max-width: 756px)': { display: 'none' } }}>
      <Group position='apart'>
        <AvatarName avatar={avatar} name={name} />
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
            <AvatarName avatar={s.avatar} name={s.name} undername='Popular' />
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
