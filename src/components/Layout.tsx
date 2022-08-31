import { Container } from '@mantine/core'
import React from 'react'
import Header from './Header/Header'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Container fluid px={0} sx={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#FAFAFA', }}>{children}</Container>
    </>
  )
}

export default Layout
