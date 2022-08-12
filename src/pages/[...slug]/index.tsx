import { Container } from '@mantine/core'
import React from 'react'
import Profile from '../../components/Profile/Profile'

const ProfilePage = ({ data }: any) => {
  console.log(data)
  return (
    <>
      <Profile />
    </>
  )
}

export default ProfilePage

export const getServerSideProps = (ctx: any) => {
  const slug = ctx.params.slug
  let data

  if (slug.length === 1) {
    data = { username: 'username', id: 1 }
  }

  if (slug.length === 2 && slug.includes('tagged')) {
    data = { username: 'username', id: 1, tagged: true }
  }
  

  return {
    props: {
      data,
    },
  }
}
