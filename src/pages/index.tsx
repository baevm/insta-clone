import { Box, Button, Container, FileButton } from '@mantine/core'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Header from '../components/Header/Header'
import MainContent from '../components/MainContent'
import fetcher from '../utils/fetcher'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const { data } = useSession()

  const createPost = trpc.useMutation(['post.create-post'])

  const deletePost = trpc.useMutation(['post.delete-post'])

  const handleSubmit = () => {
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      uploadImageToCloud(reader.result)
    }

    reader.onerror = () => {
      console.log('reading error')
    }
  }

  const uploadImageToCloud = async (img: any) => {
    createPost.mutate({ image: img, caption: 'test' })
  }

  const handleDelete = async (id: string) => {
    deletePost.mutate({ id: 'cl6lw7sgi0001h0uzgkvcbg3f' })
  }

  return (
    <>
      <Header />
      <Container fluid px={0} sx={{ height: 'calc(100vh - 60px)', backgroundColor: '#FAFAFA' }}>
        <MainContent />
      </Container>
    </>
  )
}

export default Home
