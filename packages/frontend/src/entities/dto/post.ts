import z from "zod"
import { Post } from "../post"
import { Series } from "../series"
import { zDayjs } from "../vals"
import { MdxContent } from "./mdx"

const PostBareDto = Post.omit({
    excerpt: true
}).extend({})
export const PostPreviewDto = PostBareDto.omit({
    headings: true
}).extend({
    excerpt: MdxContent
})
export type PostPreviewDto = z.output<typeof PostPreviewDto>
export const PostListingDto = PostBareDto.omit({
    headings: true
})
export type PostListingDto = z.output<typeof PostListingDto>
export const PostFullDto = PostBareDto.extend({
    body: MdxContent
})
export type PostFullDto = z.output<typeof PostFullDto>
export const PostFormat = z.enum(["preview", "listing", "full"])
export type PostFormat = z.output<typeof PostFormat>
export const PostFullDtoWithSeries = PostFullDto.extend({
    series: Series,
    published: zDayjs,
    updated: zDayjs
})
export type PostFullDtoWithSeries = z.output<typeof PostFullDtoWithSeries>

export const PostPreviewDtoWithSeries = PostPreviewDto.extend({
    series: Series,
    published: zDayjs,
    updated: zDayjs
})
export type PostPreviewDtoWithSeries = z.output<typeof PostPreviewDtoWithSeries>
export const PostListingDtoWithSeries = PostListingDto.extend({
    series: Series,
    published: zDayjs,
    updated: zDayjs
})
export type PostListingDtoWithSeries = z.output<typeof PostListingDtoWithSeries>
export const PostSearchOptions = z.object({
    series: z.string().optional(),
    offset: z.number().optional(),
    limit: z.number().optional(),
    format: PostFormat
})

export type PostSearchOptions<Format extends PostFormat> = z.output<typeof PostSearchOptions> & {
    format: Format
}

export type PostGetOptions<Format extends PostFormat> = {
    slug: string
    format: Format
}
