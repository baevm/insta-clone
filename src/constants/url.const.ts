import { isDev } from '../utils/isDev'

export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

export const url = isDev ? `http://localhost:3000/api/trpc` : `https://${process.env.NEXT_PUBLIC_VERCEL_ENV}/api/trpc`
