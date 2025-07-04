import { getBlogApi } from "@/api"
import HomeBody from "@/parts/home-page/home-body"
import { seq } from "doddle"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { shareImageProperties } from "./metadata-common"
export const dynamic = "force-dynamic"
export default async function HomePage() {
    const api = getBlogApi(headers())
    const allSeries = await api.allSeries.pull()
    const latest = await api
        .getPosts({
            format: "preview"
        })
        .toSeq()
        .pull()
    return <HomeBody series={seq([...allSeries.values()])} latest={latest} otherStuff={latest} />
}

export async function generateMetadata(): Promise<Metadata> {
    const api = getBlogApi(headers())
    const meta = await api.getMeta()
    const urls = api.urls
    const description = meta.description
    const titleStr = api.blogHostname
    return {
        title: titleStr,
        alternates: {
            canonical: urls.home()
        },
        description: description,
        openGraph: {
            type: "website",
            title: titleStr,
            description: description,
            images: [
                {
                    url: urls.ogImage(""),
                    height: shareImageProperties.height,
                    width: shareImageProperties.width
                }
            ]
        }
    }
}
