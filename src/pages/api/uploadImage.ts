import { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_SECRET,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { img } = req.body

  try {
    const data = await cloudinary.uploader.upload(img, { upload_preset: 'react-upload' })

    console.log(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
