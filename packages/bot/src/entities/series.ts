import { z } from "zod"
import { FlexDate, Slug } from "./vals.js"

export const Series = z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string(),
    hidden: z.boolean().optional(),
    color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .readonly(),
    slug: Slug,
    posts: z.array(Slug),
    count: z.number(),
    updatedTime: FlexDate,
    lastNewPost: FlexDate,
    firstPost: FlexDate
})
export type Series = z.output<typeof Series>
