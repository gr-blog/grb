import { z } from "zod"
import { zDayjs } from "./vals"

export function mins(v: number) {
    return `${v} mins`
}

export function formatWords(v: number) {
    if (v < 100) {
        return `${Math.ceil(v / 10)}0 words`
    }
    if (v < 1000) {
        return `${Math.ceil(v / 100)}00 words`
    }
    return `${(v / 1000).toFixed(1)}k words`
}
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
