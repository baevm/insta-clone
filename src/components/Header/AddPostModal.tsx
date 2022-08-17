import { Carousel } from '@mantine/carousel'
import {
  Accordion,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  Text,
  Textarea,
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useMediaQuery } from '@mantine/hooks'
import React, { useRef, useState } from 'react'
import { BsUpload } from 'react-icons/bs'
import { IoLocationOutline } from 'react-icons/io5'
import { MdClose, MdPhoto } from 'react-icons/md'
import { trpc } from '../../utils/trpc'

type Stages = 'upload' | 'preview' | 'post'

const AddPostModal = ({ isModalOpened, setIsModalOpened }: any) => {
  const matches = useMediaQuery('(min-width: 556px)', false)
  const openRef = useRef<() => void>(null)
  const { mutate, isLoading } = trpc.useMutation(['post.create-post'])
  const [files, setFiles] = useState<File[]>([])
  const [caption, setCaption] = useState('')
  const [stage, setStage] = useState<Stages>('upload') // modal tabs

  const previews = () => {
    if (files.length > 1) {
      return (
        <Carousel
          styles={{
            control: {
              '&[data-inactive]': {
                opacity: 0,
                cursor: 'default',
              },
            },
          }}>
          {files.map((file, index) => {
            const imageUrl = URL.createObjectURL(file)
            return (
              <Carousel.Slide
                key={index}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Image src={imageUrl} imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }} alt='preview' />
              </Carousel.Slide>
            )
          })}
        </Carousel>
      )
    }

    return files.map((file, index) => {
      const imageUrl = URL.createObjectURL(file)
      return (
        <Image key={index} src={imageUrl} imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }} alt='preview' />
      )
    })
  }

  const handleClose = () => {
    setFiles([])
    setIsModalOpened(false)
    setStage('upload')
  }

  function readFileAsUrl(file: any) {
    return new Promise(function (resolve, reject) {
      let fr = new FileReader()

      fr.onload = function () {
        resolve(fr.result)
      }

      fr.onerror = function () {
        reject(fr)
      }

      fr.readAsDataURL(file)
    })
  }

  const handleSubmit = () => {
    if (!files) return

    let readers = []
    setStage('post')
    for (let i = 0; i < files.length; i++) {
      readers.push(readFileAsUrl(files[i]))
    }
    Promise.all(readers).then((values) => {
      uploadImageToCloud(values)
    })
  }

  const uploadImageToCloud = async (imges: any) => {
    mutate({ images: imges, caption })
  }

  return (
    <Modal
      opened={isModalOpened}
      onClose={handleClose}
      centered
      size={'1100px'}
      withCloseButton={false}
      padding={0}
      radius={10}
      sx={{ zIndex: 2000 }}>
      <Group position='apart' sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
        <div></div>
        <Box>Create new post</Box>
        {stage === 'preview' ? (
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
        <Box sx={{ display: 'flex', flexDirection: matches ? 'row' : 'column', width: '100%' }}>
          {stage === 'upload' && (
            <Dropzone
              openRef={openRef}
              onDrop={(files) => {
                setFiles(files)
                setStage('preview')
              }}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
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
          {stage === 'preview' && (
            <>
              <Box sx={{ width: '70%' }}>{previews()}</Box>
              <Box sx={{ borderLeft: '1px solid lightgray', width: '30%' }}>
                <Box sx={{ borderBottom: '1px solid lightgray' }}>
                  <Group p='0.5rem'>
                    <Avatar radius='xl' />
                    <Text weight='bold'>dezzerlol</Text>
                  </Group>
                  <Textarea
                    onChange={(e) => setCaption(e.target.value)}
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
          )}
          {stage === 'post' && (
            <Center sx={{ width: '100%', height: '600px' }}>
              {isLoading ? (
                <Loader size='xl' color='blue' />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <MdPhoto size={50} />
                  Post shared
                </Box>
              )}
            </Center>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default React.memo(AddPostModal)
