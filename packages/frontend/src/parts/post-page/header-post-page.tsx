import { PostFullDtoWithSeries } from "@/entities/dto/post"
import { Series } from "@/entities/series"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import TitleCrumbsHeader from "../crumbs-title/title-breadcrumbs"
import HomeLink from "../crumbs/home-link"
import SeriesLink from "../links/series-link"

export const HeaderPostPageProps = z.object({
    post: PostFullDtoWithSeries,
    allSeries: zd.seq(Series)
})
export type HeaderPostPageProps = z.output<typeof HeaderPostPageProps>
export default zr.checked(
    HeaderPostPageProps,
    function HeaderPostPage({ post, allSeries }: HeaderPostPageProps) {
        return (
            <>
                <TitleCrumbsHeader heading={post.title} allSeries={allSeries}>
                    <HomeLink />
                    <SeriesLink series={post.series} className="series-link">
                        {post.series.title}
                    </SeriesLink>
                </TitleCrumbsHeader>
            </>
        )
    }
)
