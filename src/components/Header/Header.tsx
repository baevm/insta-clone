import { Anchor, Container } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useMe } from '../../hooks/useMe'
import Buttons from './Buttons'
import Search from './Search'

const Header = () => {
  const { me } = useMe()

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
        <Buttons avatar={me?.profile.avatar} />
      </Container>
    </Container>
  )
}

export default React.memo(Header)
