import { NextRequest, NextResponse } from "next/server"
import { getBlogApi } from "./api"
import { routerLogger } from "./app/(site)/logger"

const blacklist = [
    ".yaml",
    "/config.",
    ".env",
    ".py",
    ".php",
    "swagger",
    "_sample",
    "gatsby-",
    ".conf",
    "wp-config",
    "settings",
    "_service",
    "nodemailer"
]
export async function middleware(req: NextRequest) {
    routerLogger(`[Access Log] ${req.method} ${req.nextUrl.pathname}`)
    const { pathname } = req.nextUrl
    for (const pattern of blacklist) {
        if (pathname.includes(pattern)) {
            return NextResponse.json({}, { status: 404 })
        }
    }
    const api = getBlogApi(req.headers)
    const match = pathname.match(/^\/post\/(?<slug>[^/]+)\/?$/)
    if (match) {
        const slug = match.groups!.slug
        const post = await api.getPost({
            slug: slug,
            format: "listing"
        })
        const url = req.nextUrl.clone()
        url.pathname = `/${post.series.slug}/${slug}`

        return NextResponse.redirect(url, 301)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/post/:slug*"]
}
