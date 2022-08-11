import { z } from 'zod'

const MAX_FILE_SIZE = 1500000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const PostSchema = z.object({
  image: z.string(),
  /* .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 15MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ), */
  caption: z.string().optional(),
})

export const DeletePostSchema = z.object({
  id: z.string(),
})

export type IDeletePostSchema = z.infer<typeof DeletePostSchema>

export type IPostSchema = z.infer<typeof PostSchema>
