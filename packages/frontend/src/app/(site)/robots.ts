import { getBlogApi } from "@/api"
import type { MetadataRoute } from "next"
import { headers } from "next/headers"

export default function robots(): MetadataRoute.Robots {
    const urls = getBlogApi(headers()).urls
    return {
        rules: [
            {
                userAgent: "*",
                allow: [urls.externalUrl`/`, urls.externalUrl`/api/og/*`]
            }
        ],
        sitemap: urls.externalUrl`/sitemap.xml`
    }
}
