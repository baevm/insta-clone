import { Box, Button, Center, Group, Image, Loader, Modal, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useRef, useState } from 'react'
import { BsUpload } from 'react-icons/bs'
import { MdClose, MdPhoto } from 'react-icons/md'
import { readFileAsUrl } from '../../utils/readFileAsUrl'
import { trpc } from '../../utils/trpc'

type Stages = 'upload' | 'preview' | 'post'

const Previews = ({ file }: { file: File[] }) => {
  return (
    <>
      {file.map((file, index) => {
        const imageUrl = URL.createObjectURL(file)
        return (
          <Image
            key={index}
            src={imageUrl}
            imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            alt='preview'
          />
        )
      })}
    </>
  )
}

const UploadAvatarModal = ({ avatarModal, setAvatarModal }: any) => {
  const utils = trpc.useContext()
  const [stage, setStage] = useState<Stages>('upload') // modal tabs
  const [file, setFile] = useState<File[]>([])
  const openRef = useRef<() => void>(null)

  const uploadAvatar = trpc.useMutation(['user.set-avatar'], {
    onSuccess() {
      utils.invalidateQueries('user.get-profile')
    },
  })

  const handleClose = () => {
    setFile([])
    setAvatarModal(false)
    setStage('upload')
  }

  const handleSubmit = () => {
    if (!file) return
    setStage('post')
    let readers = []
    for (let i = 0; i < file.length; i++) {
      readers.push(readFileAsUrl(file[i]))
    }

    Promise.all(readers).then((values) => {
      uploadAvatar.mutate({ image: values[0] })
    })
  }

  return (
    <Modal opened={avatarModal} onClose={handleClose} centered zIndex={2000} withCloseButton={false} padding={0}>
      <Group id='modal-header' position='apart' sx={{ borderBottom: '1px solid lightgray', padding: '0.5rem' }}>
        <div></div>
        <Box>Upload avatar</Box>
        {stage === 'preview' ? (
          <Box>
            <Button variant='subtle' compact onClick={handleSubmit}>
              Upload
            </Button>
          </Box>
        ) : (
          <div></div>
        )}
      </Group>

      {stage === 'upload' && (
        <Dropzone
          openRef={openRef}
          onDrop={(file) => {
            setFile(file)
            setStage('preview')
          }}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          sx={(theme) => ({
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 0,
          })}>
          <Group position='center' spacing='xl' sx={{ minHeight: 600, pointerEvents: 'none' }}>
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
              <Text size='xl'>Drag photo here</Text>

              <Button onClick={() => openRef.current && openRef.current()} size='xs'>
                Select file
              </Button>
            </Group>
          </Group>
        </Dropzone>
      )}

      {stage === 'preview' && (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Previews file={file} />
        </Box>
      )}

      {stage === 'post' && (
        <Center sx={{ width: '100%', height: '600px' }}>
          {uploadAvatar.isLoading ? (
            <Loader size='xl' color='blue' />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <MdPhoto size={50} />
              Avatar uploaded
            </Box>
          )}
        </Center>
      )}
    </Modal>
  )
}

export default UploadAvatarModal
