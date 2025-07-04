import { PostListingDtoWithSeries, PostPreviewDtoWithSeries } from "@/entities/dto/post"
import { Series } from "@/entities/series"
import PostPreviewList from "@/parts/preview-list/preview-list"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import SeriesGrid from "../series-grid/series-grid"
import "./list-body.scss"

export const ListBodyProps = z.object({
    latest: zd.seq(PostPreviewDtoWithSeries),
    header: z.any(),
    pageName: z.string(),
    attrs: z.record(z.string()).optional(),
    series: zd.seq(Series),
    selectedSeries: Series.optional(),
    otherStuff: zd.seq(PostListingDtoWithSeries)
})
export type ListBodyProps = z.infer<typeof ListBodyProps>
export default zr.checked(
    ListBodyProps,
    function ListBody({
        latest,
        selectedSeries,
        header,
        pageName,
        attrs,
        series,
        otherStuff
    }: ListBodyProps) {
        return (
            <div className={`page list-page ${pageName}-page`} {...attrs}>
                {header}

                <div className="list-page__content page-content">
                    <main className="list-page__latest">
                        <PostPreviewList
                            previewedPosts={latest}
                            itemPosts={otherStuff}
                            intersperse={3}
                            intersperseOffset={1}
                            chunkSize={2}
                        />
                    </main>
                    <aside className="list-page__aside">
                        <h2>Series</h2>
                        <nav className="list-page__series">
                            <SeriesGrid series={series} selectedSeries={selectedSeries} />
                        </nav>
                    </aside>
                </div>
            </div>
        )
    }
)
