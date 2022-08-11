import { Button, Input } from '@mantine/core'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ISignupSchema } from '../../server/schemas/user.schema'
import { trpc } from '../../utils/trpc'

const Signup = () => {
  const { handleSubmit, register } = useForm<ISignupSchema>()

  const { mutate, error } = trpc.useMutation(['user.signup'])

  const registerAccount = (values: ISignupSchema) => {
    mutate({ ...values })
  }
  return (
    <form onSubmit={handleSubmit(registerAccount)}>
      <Input type='email' placeholder='email' {...register('email')} />
      <Input type='text' placeholder='username' {...register('name')} />
      <Input type='password' placeholder='password' {...register('password')} />
      <Button type='submit'>Submit</Button>
    </form>
  )
}

export default Signup
