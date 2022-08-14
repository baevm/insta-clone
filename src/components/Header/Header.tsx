import { Anchor, Container } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Buttons from './Buttons'
import Search from './Search'

const Header = () => {
  return (
    <Container
      fluid
      px='xs'
      sx={{
        height: '60px',
        borderBottom: '1px solid lightgray',
        position: 'fixed',
        width: '100%',
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

        <Buttons />
      </Container>
    </Container>
  )
}

export default React.memo(Header)
