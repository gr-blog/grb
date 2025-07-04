import { z } from "zod"

export const PostStats = z.object({
    readTime: z.number(),
    words: z.number()
})
export type PostStats = z.infer<typeof PostStats>
