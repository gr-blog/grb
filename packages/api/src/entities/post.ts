import { createHash } from "crypto"
import dayjs, { type Dayjs } from "dayjs"
import { z } from "zod"
import { zd } from "../zod/doddle/index.js"
import "../zod/exts.js"
import { Heading } from "./heading.js"
import { PostStats } from "./stats.js"
import { Slug, zDayjs } from "./vals.js"
export const SimpleDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform(v => dayjs(v) as Dayjs)

Error.stackTraceLimit = 100000
export const PostFm = z.object({
    title: z.string(),
    heading: z.string().optional(),
    hidden: z.boolean().default(false),
    figure: z.string().optional(),
    published: z
        .date()
        .transform(v => dayjs(v))
        .or(SimpleDate)
        .or(zDayjs),
    updated: z
        .date()
        .transform(v => dayjs(v))
        .or(SimpleDate)
        .or(zDayjs)
})

export type PostFm = z.output<typeof PostFm>

export const PostFingerprintInfo = z.object({
    title: z.string(),
    published: zDayjs,
    updated: zDayjs,
    slug: Slug,
    seriesName: Slug,
    body: z.string()
})
export type PostFingerprintInfo = z.infer<typeof PostFingerprintInfo>
export const PostFile = PostFingerprintInfo.extend({
    hidden: z.boolean(),
    stats: z.lazy(() => PostStats),
    slug: Slug,
    path: z.string(),
    fingerprint: z.string(),
    pos: z.number().int(),
    excerpt: z.string(),
    figure: z.string().optional(),
    description: z.string(),
    headings: z.array(Heading)
})

export type PostFile = z.infer<typeof PostFile>
export const Post = PostFile
export type Post = z.infer<typeof Post> & {
    stats: PostStats
    seriesName: Slug
    pos: number
    headings: Heading[]
}

zd.setPathId(Post, (v, i) => v.slug)

export function generateFingerprint(post: PostFingerprintInfo): string {
    const parts = [
        post.title,
        post.published.unix(),
        post.updated.unix(),
        post.slug,
        post.seriesName,
        post.body
    ].join("|")
    const hash = createHash("sha256").update(parts).digest("hex")
    return hash
}
