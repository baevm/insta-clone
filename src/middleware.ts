export { default } from 'next-auth/middleware'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


export const config = { matcher: ['/'] }
