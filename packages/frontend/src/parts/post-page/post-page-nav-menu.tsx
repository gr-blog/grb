import { PostListingDtoWithSeries } from "@/entities/dto/post"
import { Series } from "@/entities/series"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import PostItemGrid from "../post-item-grid/post-item-grid"
import SeriesGrid from "../series-grid/series-grid"

export const PostPageNavMenuProps = z.object({
    allSeries: zd.seq(Series),
    beforePosts: zd.seq(PostListingDtoWithSeries)
})
export type PostPageNavMenuProps = z.infer<typeof PostPageNavMenuProps>

export default zr.checked(
    PostPageNavMenuProps,
    function PostPageNavMenu({ allSeries, beforePosts }: PostPageNavMenuProps) {
        const relatedPart =
            beforePosts.count().pull() > 0 ? (
                <h2 className="post-page__before__header nav-header">Related</h2>
            ) : null
        return (
            <>
                {relatedPart}
                <PostItemGrid className="post-page__before" posts={beforePosts} columns={1} />
                <h2 className="post-page__series__header nav-header">Series</h2>{" "}
                <nav className="list-page__series">
                    <SeriesGrid series={allSeries} />
                </nav>
            </>
        )
    }
)
