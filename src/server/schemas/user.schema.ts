import { z } from 'zod'

export const UserSignupSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(30, { message: 'Must be 30 or less characters long' }),
  email: z.string().email(),
  password: z.string().min(6, { message: 'Must be 6 or more characters long' }),
})

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: 'Must be 6 or more characters long' }),
})

export type ISignupSchema = z.infer<typeof UserSignupSchema>
export type ILoginSchema = z.infer<typeof UserLoginSchema>
