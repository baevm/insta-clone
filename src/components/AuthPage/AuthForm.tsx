import { Anchor, Box, Button, Center, Container, Image, Input, Text } from '@mantine/core'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ISignupSchema, UserSignupSchema, UserLoginSchema } from '../../server/schemas/user.schema'
import { trpc } from '../../utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import Toast from '../Toast'

type TypeProps = 'login' | 'signup'

const AuthForm = ({ type }: { type: TypeProps }) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ISignupSchema>({
    resolver: zodResolver(type === 'login' ? UserLoginSchema : UserSignupSchema),
  })

  const signup = trpc.useMutation(['user.signup'], {
    onSuccess() {
      setIsToastOpen(true)

      setTimeout(() => {
        setIsToastOpen(false)
      }, 6000)
    },
  })
  const [loginError, setLoginError] = useState<string | undefined>('')
  const [isToastOpen, setIsToastOpen] = useState(false)

  const handleLogin = async (values: ISignupSchema) => {
    await signIn('credentials', { ...values, redirect: false }).then((res) => {
      if (res?.ok) {
        router.push('/')
      } else {
        setLoginError(res?.error)
      }
    })
  }


  const handleRegister = (values: ISignupSchema) => {
    signup.mutate({ ...values })
  }

  return (
    <Container
      fluid
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
      }}>
      <Box
        mb='1rem'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',

          '@media (min-width: 756px)': {
            padding: '4rem',
            border: '1px solid lightgray',
            backgroundColor: 'white',
          },
        }}>
        <Image src='/logo.svg' alt='logo' width={200} mb='2rem' />
        <form onSubmit={handleSubmit(type === 'login' ? handleLogin : handleRegister)}>
          <Input type='email' placeholder='email' {...register('email')} variant='filled' sx={{ width: '240px' }} />
          {errors.email?.message && (
            <Text color='red' size='xs'>
              {errors.email?.message}
            </Text>
          )}

          {type === 'signup' && (
            <>
              <Input
                type='text'
                placeholder='username'
                {...register('name')}
                variant='filled'
                mt='0.5rem'
                sx={{ width: '240px' }}
              />
              {errors.name?.message && (
                <Text color='red' size='xs'>
                  {errors.name?.message}
                </Text>
              )}
            </>
          )}

          <Input
            type='password'
            placeholder='password'
            {...register('password')}
            mt='0.5rem'
            variant='filled'
            sx={{ width: '240px' }}
          />
          {errors.password?.message && (
            <Text color='red' size='xs'>
              {errors.password?.message}
            </Text>
          )}
          <Button type='submit' mt='1rem' size='xs' sx={{ width: '100%', fontSize: '14px' }}>
            {type === 'login' ? 'Login' : 'Sign up'}
          </Button>
        </form>
        
        {signup.error && (
          <Text color='red' mt='1rem' size='xs'>
            {signup.error?.message}
          </Text>
        )}

        {loginError && (
          <Text color='red' mt='1rem' size='xs'>
            {loginError}
          </Text>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '250px',

          '@media (min-width: 756px)': {
            padding: '1rem',
            border: '1px solid lightgray',
            backgroundColor: 'white',
            width: '370px',
          },
        }}>
        {type === 'login' ? (
          <Box component='span'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' passHref>
              <Anchor weight='bold'>Sign up</Anchor>
            </Link>
          </Box>
        ) : (
          <Box component='span'>
            Have an account?{' '}
            <Link href='/login' passHref>
              <Anchor weight='bold'>Log in</Anchor>
            </Link>
          </Box>
        )}
      </Box>
      {isToastOpen && <Toast text='Account successfully created.' />}
    </Container>
  )
}

export default AuthForm
