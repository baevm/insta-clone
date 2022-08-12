import { Button, Input } from '@mantine/core'
import { unstable_getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ISignupSchema } from '../../server/schemas/user.schema'
import { trpc } from '../../utils/trpc'
import { nextAuthOptions } from '../api/auth/[...nextauth]'

const Login = () => {
  const { handleSubmit, register } = useForm<ISignupSchema>()

  const handleLogin = async (values: ISignupSchema) => {
    await signIn('credentials', { ...values, callbackUrl: '/' })
  }
  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Input type='email' placeholder='email' {...register('email')} />

      <Input type='password' placeholder='password' {...register('password')} />
      <Button type='submit'>Submit</Button>
    </form>
  )
}

export default Login

Login.noHeader = true

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions)

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  }
}
