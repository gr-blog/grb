import { Series } from "@/entities/series"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import TitleCrumbsHeader from "../crumbs-title/title-breadcrumbs"
import HomeLink from "../crumbs/home-link"

export const HeaderSeriesPageProps = z.object({
    series: Series,
    allSeries: zd.seq(Series)
})
export type HeaderSeriesPageProps = z.infer<typeof HeaderSeriesPageProps>
export default zr.checked(
    HeaderSeriesPageProps,
    function HeaderSeriesPage({ series, allSeries }: HeaderSeriesPageProps) {
        return (
            <TitleCrumbsHeader heading={series.title} allSeries={allSeries}>
                <HomeLink />
            </TitleCrumbsHeader>
        )
    }
)
