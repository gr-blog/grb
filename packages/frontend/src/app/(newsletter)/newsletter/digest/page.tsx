import { getBlogApi } from "@/api"
import DigestBody from "@/newsletter-parts/digest"
import dayjs from "dayjs"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Framing } from "../../framing"

function formatPreview(series: string[]) {
    if (series.length === 0) {
        throw new Error("No series found")
    }
    if (series.length === 1) {
        var seriesSubject = series[0]
    } else if (series.length === 2) {
        var seriesSubject = `${series[0]} and ${series[1]}`
    } else {
        const [first, ...rest] = series
        var seriesSubject = `${rest.join(", ")}, and ${first}`
    }
    return `New posts in the ${seriesSubject} series!`
}

export default async function DigestPage() {
    const api = getBlogApi(headers())
    const posts = await api
        .getPosts({
            format: "listing",
            limit: 3,
            after: dayjs().subtract(7, "day").subtract(1, "second").unix()
        })
        .toSeq()
        .pull()
    if (posts.count().pull() === 0) {
        notFound()
    }

    return (
        <Framing api={api}>
            <DigestBody posts={posts} api={api} />
        </Framing>
    )
}

export async function generateMetadata() {
    const api = getBlogApi(headers())
    const posts = await api
        .getPosts({
            format: "listing",
            limit: 3
        })
        .toSeq()
        .pull()

    const allSeries = posts
        .map(p => p.series.title)
        .uniq()
        .toArray()
        .pull()
    return {
        title: `This week from ${api.blogHostname}`,
        description: formatPreview(allSeries)
    } as Metadata
}
