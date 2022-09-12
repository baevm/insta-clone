import { Center, Container, Image } from '@mantine/core'
import React from 'react'
import { useMe } from '../hooks/useMe'
import Header from './Header/Header'
import SEO from './SEO'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoadingMe, me } = useMe()

  if (!me && isLoadingMe) {
    return (
      <>
        <SEO title='Instagram' />
        <Center sx={{ width: '100vw', height: '100vh' }}>
          <Image src='/Instagram_logo_color.svg' alt='Loading logo' width='70px' />
        </Center>
      </>
    )
  }

  return (
    <>
      <Header />
      <Container fluid px={0} sx={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#FAFAFA' }}>
        {children}
      </Container>
    </>
  )
}

export default Layout
