import { createZodDto } from "nestjs-zod"
import z from "zod"
import { Post } from "../../entities/post.js"
import { zDayjsLike } from "../../entities/vals.js"
import { MdxContent } from "./mdx.js"

const PostBareDto = Post.omit({
    body: true,
    excerpt: true
})
export const PostAnnounceDto = PostBareDto.omit({
    headings: true
})
export const PostPreviewDto = PostBareDto.omit({
    headings: true
}).extend({
    excerpt: MdxContent
})

export const PostListingDto = PostBareDto

export const PostFullDto = PostBareDto.extend({
    body: MdxContent
})
export const PostSearchOptions = z.object({
    series: z.string().optional(),
    offset: z.number().optional(),
    before: zDayjsLike.optional(),
    after: zDayjsLike.optional(),
    limit: z
        .string()
        .default("100")
        .optional()
        .transform(v => {
            return v ? parseInt(v, 10) : undefined
        })
})

export type PostSearchOptions = z.output<typeof PostSearchOptions>
export const PostFormat = z.enum(["preview", "listing", "full", "announce"])
export type PostFormat = z.infer<typeof PostFormat>
export class PostSearchOptionsDto extends createZodDto(
    PostSearchOptions.extend({
        format: PostFormat
    })
) {}
