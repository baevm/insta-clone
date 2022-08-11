import { z } from 'zod'

export const UserSignupSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
})

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type ISignupSchema = z.infer<typeof UserSignupSchema>
export type ILoginSchema = z.infer<typeof UserLoginSchema>
