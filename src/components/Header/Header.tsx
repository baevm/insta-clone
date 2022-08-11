import { Box, Container } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Image from 'next/image'
import React from 'react'
import Buttons from './Buttons'
import Search from './Search'

const Header = () => {
  const matches = useMediaQuery('(min-width: 768px)', false)

  return (
    <>
      <Container
        fluid
        px='xs'
        sx={{
          height: '60px',
          borderBottom: '1px solid lightgray',
        }}>
        <Container
          fluid={matches ? false : true}
          px={0}
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ width: '103px', height: '36px', display: 'flex', alignItems: 'center' }}>
            <Image src='/logo.svg' width={103} height={36} alt='logo' />
          </Box>

          <Search />

          <Buttons />
        </Container>
      </Container>
    </>
  )
}

export default React.memo(Header)
