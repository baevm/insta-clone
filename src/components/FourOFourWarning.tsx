import React from 'react'
import Link from 'next/link'
import { Anchor, Center, Text, Title } from '@mantine/core'

const FourOFourWarning = () => {
  return (
    <Center sx={{ flexDirection: 'column' }} py='4rem'>
      <Title order={3}>Sorry this page isn&apos;t avaliable</Title>
      <Text>
        The link you followed may be broken, or the page may have been removed.{' '}
        <Link href='/' passHref>
          <Anchor>Go back to Instagram.</Anchor>
        </Link>
      </Text>
    </Center>
  )
}

export default FourOFourWarning
