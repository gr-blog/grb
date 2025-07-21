import { Series } from "@/entities/series"
import { zr } from "@/zod/react"
import { z } from "zod"
import SeriesLink from "../links/series-link"
export const SeriesBarLinkProps = z.object({
    series: Series,
    max: z.number()
})
export type SeriesBarLinkProps = z.infer<typeof SeriesBarLinkProps>
export default zr.checked(
    SeriesBarLinkProps,
    function SeriesBigLink({ series, max }: SeriesBarLinkProps) {
        return (
            <SeriesLink series={series} className="series-big-link">
                <div className="series-big-link__title">{series.title}</div>
                <div
                    className="series-big-link__bar"
                    style={{ width: getWidth(series.count, max) }}
                ></div>
                {/* <div
                    className="series-big-link__count"
                    style={{
                        display: "none"
                    }}
                >
                    {series.count}
                </div> */}
                <div className="series-big-link__tagline">{series.tagline}</div>
            </SeriesLink>
        )
    }
)
function computeWidth(count: number, max: number) {
    return 0.3 + count / Math.sqrt(max)
}

function getWidth(count: number, max: number) {
    return `${computeWidth(count, max) * 20}px`
}
