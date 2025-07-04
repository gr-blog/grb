import { PostListingDtoWithSeries, PostPreviewDtoWithSeries } from "@/entities/dto/post"
import { Series } from "@/entities/series"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import ListBody from "../list-body/list-body"
import HeaderSeriesPage from "./header-series-page"
import "./series-page.scss"

export const SeriesPageProps = z.object({
    series: Series,
    allSeries: zd.seq(Series),
    others: zd.seq(Series),
    posts: zd.seq(PostPreviewDtoWithSeries),
    otherStuff: zd.seq(PostListingDtoWithSeries)
})

export type SeriesPageProps = z.infer<typeof SeriesPageProps>

export default zr.checked(
    SeriesPageProps,
    function SeriesBody({ posts, otherStuff, series, allSeries, others }: SeriesPageProps) {
        return (
            <ListBody
                pageName="series"
                latest={posts}
                header={<HeaderSeriesPage series={series} allSeries={allSeries} />}
                attrs={{
                    "data-series": series.slug
                }}
                selectedSeries={series}
                series={others}
                otherStuff={otherStuff}
            />
        )
    }
)
