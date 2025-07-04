import { z } from "zod"
import { zDayjs } from "./vals"

export const PostStats = z.object({
    readTime: z.number(),
    words: z.number()
})
export type PostStats = z.infer<typeof PostStats>
export const PostStatsDated = PostStats.extend({
    published: zDayjs,
    updated: zDayjs
})
export type PostStatsDated = z.infer<typeof PostStatsDated>
