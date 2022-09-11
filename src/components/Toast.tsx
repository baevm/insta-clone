import { Box } from '@mantine/core'
import React from 'react'

const Toast = ({ text }: { text: string }) => {
  return (
    <Box
      role='toast'
      sx={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        backgroundColor: '#262626',
        color: 'white',
        padding: '0.5rem',
        minWidth: '100vw',
        fontSize: '14px',
        transition: 'transform .6s ease-in-out',
        animation: 'toast-in-top .7s',

        '@keyframes toast-in-top': {
          from: {
            transform: 'translateY(100%)',
          },
          to: {
            transform: 'translateY(0)',
          },
        },
      }}>
      {text}
    </Box>
  )
}

export default Toast
