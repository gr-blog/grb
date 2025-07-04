import { getBlogApi } from "@/api"
import { aseq } from "doddle"
import { NextRequest, NextResponse } from "next/server"
import RSS from "rss"

export async function GET(req: NextRequest, res: NextResponse) {
    const grbApi = getBlogApi(req.headers)
    const feed = new RSS({
        title: grbApi.blogHostname,
        description: `Posts from ${grbApi.blogHostname}`,
        feed_url: grbApi.urls.rss(),
        site_url: grbApi.urls.home(),
        categories: await aseq(grbApi.allSeries)
            .map(x => x[1].title)
            .toArray()
            .pull(),
        image_url: grbApi.urls.homeOgImage(),
        language: "en",
        copyright: "GregRos"
    })

    const latestPosts = grbApi
        .getPosts({
            format: "listing",
            limit: 20
        })
        .map(post => {
            return {
                title: post.title,
                url: grbApi.urls.post(post.series.slug, post.slug),
                date: post.published.toDate(),
                author: "GregRos",
                categories: [post.series.title],
                description: post.description,
                enclosure: {
                    url: grbApi.urls.postOgImage(post.series.slug, post.slug),
                    type: "image/png"
                }
            } as RSS.ItemOptions
        })
    for await (const rssItem of latestPosts) {
        feed.item(rssItem)
    }
    return new Response(feed.xml({ indent: true }), {
        status: 200,
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate"
        }
    })
}
