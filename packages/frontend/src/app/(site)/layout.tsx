import { getBlogApi } from "@/api"
import GlobalFooter from "@/parts/footer/footer"
import { GoogleAnalytics } from "@next/third-parties/google"
import { doddle } from "doddle"
import type { Metadata } from "next"
import { headers } from "next/headers"
import React from "react"
import { initCompiler } from "sass"
import { firaCode, firaSans } from "../fonts"
import getSeriesColorStyleTag from "../series-color.style"
import "./layout.scss"
export const dynamic = "force-dynamic"
export interface NormalPageProps {
    children: React.ReactNode
}

const sassCompiler = doddle(() => {
    const sass = initCompiler()
    return sass
})
export default async function PageLayout({ children }: NormalPageProps) {
    const api = getBlogApi(headers())
    const meta = await api.getMeta()
    return (
        <html lang="en" className={`${firaSans.className} ${firaCode.variable}`}>
            <head>
                {await getSeriesColorStyleTag(api)}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
                />
                <GoogleAnalytics gaId={meta.gaId} />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
                    integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
                    crossOrigin="anonymous"
                ></link>
            </head>
            <body>
                <div id="menu" />

                {children}
                <GlobalFooter />
            </body>
        </html>
    )
}

export async function generateMetadata() {
    const urls = getBlogApi(headers()).urls
    return {
        authors: ["GregRos"],
        alternates: {
            types: {
                "application/rss+xml": "/rss.xml"
            }
        },
        metadataBase: new URL(`https://${urls.home()}`),
        openGraph: {
            authors: ["GregRos"],
            type: "website",
            locale: "en_US"
        }
    } as Metadata
}
