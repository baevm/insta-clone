import { z } from 'zod'

export const FollowSchema = z.object({
    userId: z.string(),
})



export type IFollowSchema = z.infer<typeof FollowSchema>

