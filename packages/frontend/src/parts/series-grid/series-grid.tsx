import { Series } from "@/entities/series"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import SeriesBigLink from "./series-bar-link"
import "./series-grid.scss"

export const SeriesGridProps = z.object({
    series: zd.seq(Series),
    selectedSeries: Series.optional()
})
export type SeriesGridProps = z.infer<typeof SeriesGridProps>
export default zr.checked(
    SeriesGridProps,
    function SeriesGrid({ series, selectedSeries }: SeriesGridProps) {
        series = series.filter(x => !x.hidden)
        const max =
            series
                .map(x => x.count)
                .maxBy(x => x)
                .pull() ?? 0
        return (
            <ul className="series-grid">
                {series.map(series => (
                    <li
                        key={series.slug}
                        className="series-grid__item"
                        data-selected={series === selectedSeries ? "true" : undefined}
                        data-series={series.slug}
                    >
                        <SeriesBigLink series={series} max={max} />
                    </li>
                ))}
            </ul>
        )
    }
)
