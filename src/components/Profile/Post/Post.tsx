import { Anchor, Grid, Modal } from '@mantine/core'
import NextImage from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import PostContainer from './PostContainer'

const Post = ({ post, name, avatar, setIsToastVisible }: any) => {
  const router = useRouter()

  
  // both links should have "shallow" parameter to prevent GSSP call on open/close modal
  return (
    <>
      <Grid.Col span={4} sx={{ cursor: 'pointer' }}>
        <Link href={`/[profile]?profile=${name}`} as={`/p/${post.id}`} passHref shallow>
          <Anchor>
            <NextImage
              src={post.images[0]}
              alt='post'
              width='100%'
              height='100%'
              layout='responsive'
              objectFit='cover'
              quality={85}
              style={{ backgroundColor: 'black' }}
            />
          </Anchor>
        </Link>
      </Grid.Col>

      {/* Opened post modal */}
      <Modal
        opened={router.asPath === `/p/${post.id}`}
        onClose={() => router.push(`/${name}`, undefined, { shallow: true })}
        centered
        withCloseButton={false}
        size='70%'
        padding={0}
        zIndex={2000}>
        <PostContainer
          type='modal'
          post={post}
          name={name}
          avatar={avatar}
          setIsToastVisible={setIsToastVisible}
        />
      </Modal>
    </>
  )
}

export default React.memo(Post)
