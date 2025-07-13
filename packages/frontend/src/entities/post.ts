import dayjs, { type Dayjs } from "dayjs"
import { z } from "zod"
import { zd } from "../zod/doddle/index"
import "../zod/exts"
import { Heading } from "./heading"
import { PostStats } from "./stats"
import { Slug, zDayjs, zDayjsLike } from "./vals"
export const SimpleDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform(v => dayjs(v) as Dayjs)

export const FlexDate = z
    .date()
    .transform(v => dayjs(v))
    .or(SimpleDate)
    .or(zDayjs)

export const PostFm = z.object({
    title: z.string(),
    heading: z.string().optional(),
    hidden: z.boolean().default(false),
    published: zDayjsLike,
    updated: zDayjsLike
})

export type PostFm = z.output<typeof PostFm>

export const hexString = z.string().regex(/^[0-9a-f]+$/i, "Must be a hex string")

export const PostFile = z.object({
    fingerprint: hexString,
    title: z.string(),
    published: zDayjsLike,
    updated: zDayjsLike,
    hidden: z.boolean(),
    stats: z.lazy(() => PostStats),
    slug: Slug,
    excerpt: z.string(),
    seriesName: Slug,
    pos: z.number().int(),
    headings: z.array(z.lazy(() => Heading)),
    description: z.string()
})

export type PostFile = z.infer<typeof PostFile>
export const Post = PostFile
export type Post = z.output<typeof Post>

zd.setPathId(Post, (v, i) => v.slug)
