import { Anchor, Box, Button, Container, Group, Skeleton } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useMe } from '../../hooks/useMe'
import Buttons from './Buttons'
import Search from './Search'

const Header = () => {
  const router = useRouter()
  const { me, status, isLoadingMe } = useMe()

  return (
    <Container
      fluid
      p={0}
      sx={{
        height: '60px',
        borderBottom: '1px solid lightgray',
        position: 'sticky',
        width: '100vw',
        backgroundColor: 'white',
        top: 0,
        zIndex: 1000,
      }}>
      <Container px={0} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href='/' passHref>
          <Anchor sx={{ width: '300px', height: '36px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Image src='/logo.svg' width={103} height={36} alt='logo' />
          </Anchor>
        </Link>

        <Search />
        {isLoadingMe ? (
          <Group spacing={24} noWrap>
            <Skeleton width='265px' height='35px' mr='1rem'/>
          </Group>
        ) : status === 'authenticated' ? (
          <Buttons avatar={me?.profile.avatar} />
        ) : (
          <Box sx={{ width: '300px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button mr='1rem' onClick={() => router.push('/login')}>
              Log in
            </Button>
          </Box>
        )}
      </Container>
    </Container>
  )
}

export default React.memo(Header)
