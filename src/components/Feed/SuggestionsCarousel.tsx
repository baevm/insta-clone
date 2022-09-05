import { Carousel } from '@mantine/carousel'
import { Anchor, Avatar, Button, Card, Group, Title } from '@mantine/core'
import Link from 'next/link'
import { Suggestions } from '../../types/app.types'
import { trpc } from '../../utils/trpc'

const SuggestionsCarousel = ({ suggestions }: { suggestions: Suggestions }) => {
  const utils = trpc.useContext()
  const { mutate } = trpc.useMutation('follow.follow', {
    onSuccess() {
      utils.invalidateQueries('feed.get-suggestions')
    },
  })

  const handleFollow = (id: string) => {
    mutate({ userId: id })
  }
  
  return (
    <Card withBorder radius='md'>
      <Card.Section pt='md' px='md'>
        <Group position='apart'>
          <Title order={6} sx={{ color: 'gray' }}>
            Suggestions for you
          </Title>

          <Button size='xs' compact variant='subtle'>
            See all
          </Button>
        </Group>
      </Card.Section>

      <Card.Section py='md' px='md'>
        <Carousel slideSize='40%' height={200} slideGap='xs' align='start'>
          {suggestions &&
            suggestions.map((s: Suggestions[number]) => (
              <Carousel.Slide
                p='1rem'
                key={s.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid lightgray',
                  borderRadius: '5px',
                }}>
                <Link href={`/${s.name}`} passHref>
                  <Anchor>
                    <Avatar size='lg' radius='xl' src={s.avatar ? s.avatar : ''} />
                  </Anchor>
                </Link>
                <Link href={`/${s.name}`} passHref>
                  <Anchor mt='1rem' underline={false} color='dark'>
                    {s.name}
                  </Anchor>
                </Link>
                <Button size='xs' mt='2rem' onClick={() => handleFollow(s.id)}>
                  Follow
                </Button>
              </Carousel.Slide>
            ))}
        </Carousel>
      </Card.Section>
    </Card>
  )
}

export default SuggestionsCarousel
