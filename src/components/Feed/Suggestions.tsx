import { Anchor, Avatar, Box, Button, Group, Text } from '@mantine/core'
import Link from 'next/link'

const suggestions = [
  { id: 1, name: 'test2' },
  { id: 2, name: 'test123123' },
  { id: 3, name: 'adasdqq111' },
]

const Suggestions = () => {
  return (
    <Box sx={{ width: '35%' }}>
      <Group position='apart'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar radius='xl' size='lg' />
          <Text weight='bold'>dezzerlol</Text>
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
        {suggestions.map((s) => (
          <Group position='apart' key={s.id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href={`/${s.name}`} passHref>
                <Anchor>
                  <Avatar size='md' />
                </Anchor>
              </Link>
              <Box>
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
            <Box>
              <Button variant='subtle'>Follow</Button>
            </Box>
          </Group>
        ))}
      </Box>
    </Box>
  )
}

export default Suggestions
