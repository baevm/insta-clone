import { Center, Container, Image } from '@mantine/core'
import React from 'react'
import { useMe } from '../hooks/useMe'
import useInterfaceStore from '../store/InterfaceStore'
import Header from './Header/Header'
import SEO from './SEO'
import Toast from './Toast'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoadingMe, me } = useMe()
  const toast = useInterfaceStore((state: any) => state.toast)

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
      {toast.open && <Toast text={toast.message} />}
    </>
  )
}

export default Layout
