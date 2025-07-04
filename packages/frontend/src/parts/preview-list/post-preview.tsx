import { PostPreviewDtoWithSeries } from "@/entities/dto/post"
import PostLink from "@/parts/links/article-link"
import { zr } from "@/zod/react"
import { z } from "zod"
import PostStatsLong from "../post-stats/stats-long"
import Prose from "../prose/prose"
import "./post-preview.scss"
export const PostPreviewProps = z.object({
    post: PostPreviewDtoWithSeries,
    className: z.string().optional()
})
export type PostPreviewProps = z.infer<typeof PostPreviewProps>
export default zr.checked(
    PostPreviewProps,
    function PostPreview({ post, className }: PostPreviewProps) {
        return (
            <div className={`post-preview ${className ?? ""}`} data-series={post.series.slug}>
                <PostLink
                    slug={post.slug}
                    series={post.series.slug}
                    className="post-preview__header"
                >
                    <header className="post-preview__header__body">
                        <h3 className="post-preview__header__title ">{post.title}</h3>
                        <div className="post-preview__header__series-link series-link">
                            {post.series.title}
                        </div>
                    </header>
                </PostLink>

                <div className="post-preview__info">
                    <PostStatsLong
                        {...post.stats}
                        published={post.published}
                        updated={post.updated}
                    />
                </div>
                <div className="post-preview__text">
                    <Prose
                        content={post.excerpt}
                        cacheKey={`preview:${post.slug}`}
                        slug={post.slug}
                    />
                </div>
                <PostLink
                    slug={post.slug}
                    series={post.series.slug}
                    className="post-preview__footer"
                >
                    <footer className="post-preview__footer__body">read more</footer>
                </PostLink>
            </div>
        )
    }
)
