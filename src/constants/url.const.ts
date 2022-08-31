export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

export const url = process.env.NEXT_PUBLIC_DEPLOY_URL
  ? `https://${process.env.DEPLOY_URL}/api/trpc`
  : 'http://localhost:3000/api/trpc'
