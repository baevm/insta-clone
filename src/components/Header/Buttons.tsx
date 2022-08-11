import {
  Accordion,
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Input,
  Loader,
  Menu,
  Modal,
  Text,
  Textarea,
} from '@mantine/core'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useMediaQuery } from '@mantine/hooks'
import { signOut } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { BsUpload } from 'react-icons/bs'
import { HiOutlineUserCircle, HiSwitchVertical } from 'react-icons/hi'
import {
  IoBookmarkOutline,
  IoChatbubbleEllipsesOutline,
  IoCompassOutline,
  IoHeartOutline,
  IoLocationOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { MdClose, MdHome, MdOutlineAddBox, MdPhoto } from 'react-icons/md'
import { trpc } from '../../utils/trpc'

type Stages = 'upload' | 'preview' | 'post'

const Buttons = (props: Partial<DropzoneProps>) => {
  const matches = useMediaQuery('(min-width: 556px)', false)
  const openRef = useRef<() => void>(null)
  const { mutate, isLoading } = trpc.useMutation(['post.create-post'])
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [caption, setCaption] = useState('')
  const [stage, setStage] = useState<Stages>('upload') // modal tabs

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <Image key={index} src={imageUrl} imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }} alt='preview' />
    )
  })

  const handleClose = () => {
    setFiles([])
    setIsModalOpened(false)
    setStage('upload')
  }

  const handleSubmit = () => {
    if (!files) return

    setStage('post')
    const reader = new FileReader()
    const file = files[0]
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      uploadImageToCloud(reader.result)
    }

    reader.onerror = () => {
      console.log('reading error')
    }
  }

  const uploadImageToCloud = async (img: any) => {
    mutate({ image: img, caption: 'test' })
  }

  return (
    <>
      <Modal
        opened={isModalOpened}
        onClose={handleClose}
        centered
        size={'1100px'}
        withCloseButton={false}
        padding={0}
        radius={10}>
        <Group position='apart' sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
          <div></div>
          <Box>Create new post</Box>
          {files.length > 0 ? (
            <Box>
              <Button variant='subtle' compact onClick={handleSubmit}>
                Share
              </Button>
            </Box>
          ) : (
            <div></div>
          )}
        </Group>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          {files.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: matches ? 'row' : 'column', width: '100%' }}>
              {stage === 'upload' ? (
                <>
                  <Box sx={{ width: '70%' }}>{previews}</Box>
                  <Box sx={{ borderLeft: '1px solid lightgray', width: '30%' }}>
                    <Box sx={{ borderBottom: '1px solid lightgray' }}>
                      <Group p='0.5rem'>
                        <Avatar radius='xl' />
                        <Text weight='bold'>dezzerlol</Text>
                      </Group>
                      <Textarea
                        placeholder='Write a caption...'
                        sx={{ width: '100%' }}
                        variant='unstyled'
                        p='0 1rem'
                        minRows={10}
                      />
                    </Box>
                    <Box sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem 1rem' }}>
                      <Input
                        placeholder='Add location'
                        variant='unstyled'
                        p={0}
                        rightSection={<IoLocationOutline size={18} />}
                      />
                    </Box>
                    <Box sx={{ borderBottom: '1px solid lightgray' }}>
                      <Accordion variant='filled'>
                        <Accordion.Item value='customization'>
                          <Accordion.Control>Accessibility</Accordion.Control>
                          <Accordion.Panel>
                            Alt text describes your photos for people with visual impairments. Alt text will be
                            automatically created for your photos or you can choose to write your own.
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </Box>
                    <Box sx={{ borderBottom: '1px solid lightgray' }}>
                      <Accordion variant='filled'>
                        <Accordion.Item value='customization'>
                          <Accordion.Control>Advanced settings</Accordion.Control>
                          <Accordion.Panel>Add here advanced settings l8</Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </Box>
                  </Box>
                </>
              ) : (
                <Center sx={{ width: '100%', height: '600px' }}>
                  {isLoading ? <Loader size='xl' color='blue' /> : <Box>Post shared</Box>}
                </Center>
              )}
            </Box>
          ) : (
            <Dropzone
              openRef={openRef}
              onDrop={setFiles}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              {...props}
              sx={(theme) => ({
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 0,
              })}>
              <Group position='center' spacing='xl' style={{ minHeight: 600, pointerEvents: 'none' }}>
                <Group sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Dropzone.Idle>
                    <MdPhoto size={50} />
                  </Dropzone.Idle>
                  <Dropzone.Accept>
                    <BsUpload size={50} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <MdClose size={50} color='red' />
                  </Dropzone.Reject>
                  <Text size='xl'>Drag photos and videos here</Text>

                  <Button onClick={() => openRef.current && openRef.current()} size='xs'>
                    Select files
                  </Button>
                </Group>
              </Group>
            </Dropzone>
          )}
        </Box>
      </Modal>

      <Box sx={{ height: '36px', display: 'flex', alignItems: 'center' }}>
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <MdHome size='1.8rem' />
        </ActionIcon>
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoChatbubbleEllipsesOutline size='1.6rem' />
        </ActionIcon>
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem' onClick={() => setIsModalOpened(true)}>
          <MdOutlineAddBox size='1.8rem' />
        </ActionIcon>
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoCompassOutline size='1.8rem' />
        </ActionIcon>
        <ActionIcon color='dark' variant='transparent' size='lg' mx='0.4rem'>
          <IoHeartOutline size='1.8rem' />
        </ActionIcon>
        <Menu shadow='md' width={200} withArrow>
          <Menu.Target>
            <Avatar radius='xl' mx='0.4rem' sx={{ cursor: 'pointer' }} />
          </Menu.Target>
          <Menu.Dropdown p={0}>
            <Menu.Item icon={<HiOutlineUserCircle size={16} />}>Profile</Menu.Item>
            <Menu.Item icon={<IoBookmarkOutline size={16} />}>Saved</Menu.Item>
            <Menu.Item icon={<IoSettingsOutline size={16} />}>Settings</Menu.Item>
            <Menu.Item icon={<HiSwitchVertical size={16} />}>Switch accounts</Menu.Item>
            <Divider />
            <Menu.Item onClick={() => signOut()}>Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  )
}

export default React.memo(Buttons)
