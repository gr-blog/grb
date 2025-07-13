import { getBlogApi } from "@/api"
import { shareImageProperties } from "@/app/(site)/metadata-common"
import { titleParts } from "@/app/(site)/title-formatter"
import { NewsletterSub } from "@/parts/newsletter-form/helpers"
import PostBody from "@/parts/post-page/post-body"
import Prose from "@/parts/prose/prose"
import { postFingerprintCache } from "@/post-cache"
import { seq } from "doddle"
import type { Metadata } from "next"
import { cookies, headers } from "next/headers"

export default async function PostPage({ params: { slug } }: { params: { slug: string } }) {
    if (slug.includes(".map")) {
        return <div>404</div>
    }
    const cks = cookies()
    const Subbed = new NewsletterSub({
        get(name) {
            return cks.get(name)?.value
        },
        set(name, value, options) {
            return cks.set(name, value, options)
        }
    })
    const api = getBlogApi(headers())
    const post = await api.getPost({
        slug,
        format: "full"
    })

    const latest = await api
        .getPosts({
            format: "preview"
        })
        .toSeq()
        .pull()
    let postsInSeries = latest.filter(x => x.series === post.series)
    const allSeries = await api.allSeries.pull()
    postsInSeries = postsInSeries.filter(x => x.slug !== post.slug).orderBy(x => x.pos)
    const position = post.pos
    const beforePosts = postsInSeries.take(position).take(-2).reverse()
    const nextPosts = postsInSeries.skip(position).take(2)
    const excludedPosts = beforePosts
        .concat(nextPosts.map(x => x))
        .concat(beforePosts)
        .concat([post])
    const alsoPosts = latest.filter(x => excludedPosts.every(y => y.slug !== x.slug)).take(6)
    let cached = await postFingerprintCache.get("full", post)
    if (cached) {
        return cached
    }
    cached = (
        <PostBody
            post={post}
            allSeries={seq(allSeries.values())}
            beforePosts={beforePosts}
            nextPosts={nextPosts}
            alsoPosts={alsoPosts}
            isNewsletterSubscribed={Subbed.isSubscribed}
        >
            <Prose content={post.body} cacheKey={`post:${post.slug}`} slug={post.slug} />
        </PostBody>
    )
    await postFingerprintCache.set("full", post, cached)
    return cached
}

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
    if (slug.includes(".map")) {
        return {}
    }
    const api = getBlogApi(headers())
    const post = await api.getPost({ slug, format: "preview" })
    const meta = await api.getMeta()
    const urls = api.urls
    return {
        title: titleParts(post.title, post.series.title, api.blogHostname),
        description: post.description,
        alternates: {
            canonical: urls.post(post.series.slug, post.slug)
        },
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: urls.postOgImage(post.series.slug, post.slug),
                    height: shareImageProperties.height,
                    width: shareImageProperties.width
                }
            ],
            publishedTime: post.published.toISOString(),
            modifiedTime: post.updated.toISOString()
        }
    } as Metadata
}
