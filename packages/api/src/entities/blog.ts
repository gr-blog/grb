import { z } from "zod"

export const BlogMeta = z.object({
    title: z.string(),
    topics: z.string().array(),
    description: z.string(),
    subtitle: z.string(),
    gaId: z.string()
})
export type BlogMeta = z.infer<typeof BlogMeta>
