import type { z } from "zod"
import { Post } from "./post.js"
import { Series } from "./series.js"

export const PostDtoWithSeries = Post.extend({
    series: Series
})
export type PostDtoWithSeries = z.infer<typeof PostDtoWithSeries>
