import { getBlogApi } from "@/api"
import { routerLogger } from "@/app/(site)/logger"
import { shareImageProperties } from "@/app/(site)/metadata-common"
import { titleParts } from "@/app/(site)/title-formatter"
import SeriesBody from "@/parts/series-page/series-body"
import { aseq } from "doddle"

import type { Metadata } from "next"
import { headers } from "next/headers"
export default async function SeriesRoute({ params: { name } }: { params: { name: string } }) {
    if (name.includes(".map")) {
        throw <div>404</div>
    }
    routerLogger.debug({ name }, "asked for series {name}")
    const api = getBlogApi(headers())
    const series = await api.getSeries(name)
    const allSeries = await aseq(api.allSeries)
        .map(x => x[1])
        .toSeq()
        .pull()
    const posts = await api
        .getPosts({
            format: "preview",
            series: name
        })
        .toSeq()
        .pull()
    const latest = await api
        .getPosts({
            format: "preview"
        })
        .toSeq()
        .pull()
    routerLogger.debug(
        {
            name,
            posts: `${posts?.count()}`,
            series: series.slug,
            latest: `${latest?.count()}`
        },
        "got series {name}"
    )
    return (
        <SeriesBody
            allSeries={allSeries}
            posts={posts}
            series={series}
            others={allSeries}
            otherStuff={latest}
        />
    )
}

export async function generateMetadata({ params: { name } }: { params: { name: string } }) {
    if (name.includes(".map")) {
        return {}
    }
    const api = getBlogApi(headers())
    const meta = await api.getMeta()
    const series = await api.getSeries(name)
    if (!series) {
        return {}
    }
    const urls = api.urls
    return {
        title: titleParts(series.description, `${series.title}`, api.blogHostname),
        description: series.description,
        alternates: {
            canonical: urls.series(name)
        },
        openGraph: {
            title: `${name} Series`,
            description: series.description,
            images: [
                {
                    url: urls.seriesOgImage(name),
                    height: shareImageProperties.height,
                    width: shareImageProperties.width,
                    type: shareImageProperties.type
                }
            ],
            publishedTime: series.lastNewPost?.toISOString(),
            modifiedTime: series.updatedTime?.toISOString()
        }
    } as Metadata
}
