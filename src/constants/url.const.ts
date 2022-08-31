export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

export const url = process.env.NEXTAUTH_URL
  ? `https://${process.env.NEXTAUTH_URL}/api/trpc`
  : 'http://localhost:3000/api/trpc'
