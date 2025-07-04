import { Dayjs } from "dayjs"
import { z, ZodType } from "zod"
import { zd } from "../zod/doddle/index"
import { Slug, zDayjsLike } from "./vals"

export const SeriesFile = z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string(),
    hidden: z.boolean().optional(),
    color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .readonly(),
    slug: Slug,
    posts: z.array(Slug)
})
export type SeriesFile = z.infer<typeof SeriesFile>
export const Series = SeriesFile.extend({
    count: z.number(),
    updatedTime: zDayjsLike.optional(),
    lastNewPost: zDayjsLike.optional(),
    firstPost: zDayjsLike.optional()
}) as ZodType<Series>
export type Series = SeriesFile & {
    count: number
    updatedTime?: Dayjs
    lastNewPost?: Dayjs
    firstPostTime?: Dayjs
}
zd.setPathId(Series, (v, i) => v.slug)
