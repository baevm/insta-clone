import { isDev } from '../utils/isDev'

export const baseUrl = isDev ? `http://localhost:3000` : 'https://insta-clone-roan.vercel.app'

export const url = isDev ? `http://localhost:3000/api/trpc` : `https://insta-clone-roan.vercel.app/api/trpc`
