import { PostListingDtoWithSeries } from "@/entities/dto/post"
import PostLink from "@/parts/links/article-link"
import { zr } from "@/zod/react"
import { z } from "zod"
import NarrowPostStats from "../post-stats/stats-short"
import "./post-item.scss"

export const PostInListProps = z.object({
    post: PostListingDtoWithSeries,
    className: z.string().optional(),
    style: z.record(z.string()).optional()
})

export type PostInListProps = z.infer<typeof PostInListProps>

export default zr.checked(
    PostInListProps,
    function PostItem({ post, className, style }: PostInListProps) {
        return (
            <li
                key={post.slug}
                className={`post-item ${className ?? ""}`}
                data-series={post.series.slug}
                style={style}
            >
                <PostLink slug={post.slug} className="post-item__content" series={post.series.slug}>
                    <h3 className="post-item__title">{post.title}</h3>
                    <div className="post-item__series">
                        <div className="series-link" data-series={post.series.slug}>
                            {post.series.title}
                        </div>
                    </div>
                    <div className="post-item__stats">
                        <NarrowPostStats
                            {...post.stats}
                            published={post.published}
                            updated={post.updated}
                        />
                    </div>
                </PostLink>
            </li>
        )
    }
)
