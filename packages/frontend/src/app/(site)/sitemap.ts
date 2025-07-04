import { getBlogApi } from "@/api"
import type { SiteUrls } from "@/api/urls"
import type { PostListingDtoWithSeries } from "@/entities/dto/post"
import type { Series } from "@/entities/series"
import getStartTime from "@/start-date"
import dayjs from "dayjs"
import { aseq, type ASeq } from "doddle"
import type { MetadataRoute } from "next"
import { headers } from "next/headers"
export const dynamic = "force-dynamic"

function seriesEntries(allSeries: ASeq<Series>, urls: SiteUrls) {
    const serieses = allSeries
        .filter(x => x.count > 0)
        .map(x => ({
            url: urls.series(x.slug),
            lastModified: x.updatedTime ?? x.lastNewPost ?? dayjs()
        }))
    return serieses
}

function postEntries(allPosts: ASeq<PostListingDtoWithSeries>, urls: SiteUrls) {
    const posts = aseq(allPosts).map(x => ({
        url: urls.post(x.series.slug, x.slug),
        lastModified: x.updated
    }))
    return posts
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const api = getBlogApi(headers())
    const urls = api.urls
    const innerEntries = aseq([])
        .concat(
            seriesEntries(
                aseq(api.allSeries).map(x => x[1]),
                urls
            ).concat(
                postEntries(
                    api.getPosts({
                        format: "listing"
                    }),
                    urls
                )
            )
        )
        .map(x => ({
            ...x,
            lastModified: x.lastModified.toDate()
        }))
        .cache()
    const homeEntry = {
        url: urls.externalUrl`/`,
        lastModified: getStartTime().toDate()
    }
    const entries = aseq([homeEntry]).concat(innerEntries).toArray().pull()
    return entries
}
