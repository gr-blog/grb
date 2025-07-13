import { Dayjs } from "dayjs"
import { z, ZodType } from "zod"
import { zd } from "../zod/doddle/index.js"
import { Slug, zDayjs } from "./vals.js"

export const SeriesFile = z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string(),
    hidden: z.boolean().optional(),
    color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .readonly(),
    slug: Slug
})
export type SeriesFile = z.infer<typeof SeriesFile>
export const Series = SeriesFile.extend({
    posts: z.array(Slug).readonly(),
    count: z.number(),
    updatedTime: zDayjs.optional(),
    lastNewPost: zDayjs.optional(),
    firstPost: zDayjs.optional()
}) as ZodType<Series>
export type Series = SeriesFile & {
    count: number
    posts: readonly Slug[]
    updatedTime?: Dayjs
    lastNewPost?: Dayjs
    firstPostTime?: Dayjs
}
zd.setPathId(Series, (v, i) => v.slug)
