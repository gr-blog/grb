import { z } from "zod"

import { PostStats } from "./stats.js"
import { FlexDate, Slug } from "./vals.js"
export type FlexDate = z.output<typeof FlexDate>
export const Post = z.object({
    title: z.string(),
    heading: z.string().optional(),
    hidden: z.boolean().default(false),
    published: FlexDate,
    updated: FlexDate,
    stats: z.lazy(() => PostStats),
    slug: Slug,
    description: z.string(),
    seriesName: Slug,
    pos: z.number().int()
})

export type Post = z.output<typeof Post>
