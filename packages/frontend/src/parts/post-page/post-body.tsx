import {
    PostFullDtoWithSeries,
    PostListingDtoWithSeries,
    PostPreviewDtoWithSeries
} from "@/entities/dto/post"
import { Series } from "@/entities/series"
import HeaderPostPage from "@/parts/post-page/header-post-page"
import PostStatsLong from "@/parts/post-stats/stats-long"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import Newsletter from "../newsletter-form/newsletter"
import PostItemGrid from "../post-item-grid/post-item-grid"
import PostPreview from "../preview-list/post-preview"
import Toc from "../toc/toc"
import PostPageNavMenu from "./post-page-nav-menu"
import "./post-page.scss"

export const PostPageProps = z.object({
    children: z.any(),
    post: PostFullDtoWithSeries,
    alsoPosts: zd.seq(PostListingDtoWithSeries),
    nextPosts: zd.seq(PostPreviewDtoWithSeries),
    allSeries: zd.seq(Series),
    beforePosts: zd.seq(PostListingDtoWithSeries),
    isNewsletterSubscribed: z.boolean()
})

export type PostPageProps = z.infer<typeof PostPageProps>

export default zr.checked(
    PostPageProps,
    async function PostBody({
        children,
        post,
        alsoPosts,
        nextPosts,
        allSeries,
        beforePosts,
        isNewsletterSubscribed
    }: PostPageProps) {
        return (
            <div
                className="page post-page"
                data-post={post.slug}
                id="post"
                data-series={post.series.slug}
            >
                <div style={{ visibility: "hidden" }} id="top" />
                <HeaderPostPage post={post} allSeries={allSeries} />
                <div className="post-page__content page-content">
                    <aside className="post-page__prev-aside">
                        <div className="post-page__toc">
                            <Toc title={post.title} toc={post.headings} />
                        </div>
                    </aside>
                    <div className="post-page__article">
                        <PostStatsLong
                            {...post.stats}
                            published={post.published}
                            updated={post.updated}
                        />
                        <article id="main" className="column2-main article">
                            {children}
                        </article>
                    </div>
                    <aside className="post-page__aside column3-main">
                        <PostPageNavMenu allSeries={allSeries} beforePosts={beforePosts} />
                    </aside>
                </div>
                <div className="post-page__next">
                    <ul className="post-page__next__list">
                        {nextPosts.map(post => (
                            <PostPreview post={post} key={post.slug} />
                        ))}
                    </ul>
                </div>
                <div className="post-page__also">
                    <PostItemGrid
                        posts={alsoPosts}
                        columns={2}
                        className="post-page__also__list"
                        hasDiscordInvites={true}
                    />
                </div>
                <Newsletter isAlreadyJoined={isNewsletterSubscribed} />
            </div>
        )
    }
)
