import { Series } from "@/entities/series"
import { zr } from "@/zod/react"
import Link from "next/link"
import { z } from "zod"
import "./series-link.scss"
export const SeriesLinkProps = z.object({
    series: Series,
    children: z.any(),
    className: z.string().optional()
})

export type SeriesLinkProps = z.infer<typeof SeriesLinkProps>

export default zr.checked(
    SeriesLinkProps,
    function SeriesLink({ series, children, className }: SeriesLinkProps) {
        return (
            <Link
                className={className ?? undefined}
                href={`/${series.slug}`}
                data-series={series.slug}
            >
                {children}
            </Link>
        )
    }
)
