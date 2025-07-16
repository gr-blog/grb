import { aseq, doddle, type ASeq } from "doddle"
import got from "got"
import qs from "qs"
import { z } from "zod"
import type { PostDtoWithSeries } from "../../entities/post-dto.js"
import { Post } from "../../entities/post.js"
import { Series } from "../../entities/series.js"
import { rootLogger } from "../../logging/index.js"
import { SiteUrls } from "./urls.js"
export const URL_GRB_API = z.string().parse(process.env.URL_GRB_API)

const blogApiLogger = rootLogger.child({
    part: "blog-api"
})

function apiRequest(url: string) {
    return got(url, {
        responseType: "json",
        method: "GET",
        throwHttpErrors: true,
        timeout: {
            request: 5000
        },
        retry: {
            limit: 6,
            statusCodes: [408, 500, 502, 503, 504]
        }
    }).catch(err => {
        blogApiLogger.error("Failed to make API request", {
            url,
            error: err.message,
            code: err.code,
            response: err.response
                ? {
                      statusCode: err.response.statusCode,
                      statusMessage: err.response.statusMessage,
                      body: err.response.body
                  }
                : undefined
        })
        throw err
    })
}
export class BlogApi {
    constructor(private readonly _blog: string) {}

    get urls() {
        return new SiteUrls(this._blog)
    }
    async getSeries(slug: string) {
        const res = await apiRequest(`${URL_GRB_API}/${this._blog}/series/${slug}`)
        return Series.parse(res.body)
    }

    allSeries = doddle(async () => {
        const seriesAseq = await aseq(async () => {
            const res = await apiRequest(`${URL_GRB_API}/${this._blog}/series`)

            return Series.array().parse(res.body)
        })
            .toSeq()
            .pull()

        const bySlug = seriesAseq.toMap(x => [x.slug, x]).pull()
        return bySlug
    })

    private _matchWithSeries(posts: Post[]): ASeq<PostDtoWithSeries> {
        return aseq(async () => {
            const allSeries = await this.allSeries.pull()
            return posts.map(post => {
                const postSeries = allSeries.get(post.series)
                return {
                    ...post,
                    series: postSeries!
                }
            }) as any
        })
    }

    getPosts({ count, after }: { count: number; after?: number }): ASeq<PostDtoWithSeries> {
        return aseq(async () => {
            const stringified = qs.stringify({
                format: "announce",
                limit: count,
                after
            })

            const res = await apiRequest(`${URL_GRB_API}/${this._blog}/posts?${stringified}`)
            const posts = (res.body as object[]).map(post => Post.parse(post))
            return this._matchWithSeries(posts)
        }).cache() as any
    }
}

export function getBlogApi(blogName: string) {
    return new BlogApi(blogName)
}
