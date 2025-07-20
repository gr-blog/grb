import { routerLogger } from "@/app/(site)/logger"
import { BlogMeta } from "@/entities/blog"
import {
    PostFormat,
    PostFullDto,
    PostFullDtoWithSeries,
    PostGetOptions,
    PostListingDto,
    PostListingDtoWithSeries,
    PostPreviewDto,
    PostPreviewDtoWithSeries,
    PostSearchOptions
} from "@/entities/dto/post"
import { Series } from "@/entities/series"
import socialUrls from "@/social-urls"
import dayjs from "dayjs"
import { aseq, doddle, type ASeq } from "doddle"
import { notFound } from "next/navigation"
import qs from "qs"
import { isLocalhost, isLocalUrl } from "./is-local-url"
import { SiteUrls } from "./urls"
export const GRB_API = process.env.GRB_API || "http://localhost:3000"

interface FormatToDoWithSeries {
    full: PostFullDtoWithSeries
    preview: PostPreviewDtoWithSeries
    listing: PostListingDtoWithSeries
}
interface FormatToDto {
    full: PostFullDto
    preview: PostPreviewDto
    listing: PostListingDto
}

const schemas = {
    full: PostFullDto,
    preview: PostPreviewDto,
    listing: PostListingDto
}

export class BlogApi {
    constructor(
        private readonly _blog: string,
        private readonly _realHost: string
    ) {}

    resolvePlaceholderUrl(content: string | undefined) {
        if (!content) {
            return content
        }
        return content.replaceAll("####GRB_API####", GRB_API)
    }

    get blogHostname() {
        return this._blog
    }

    get realHostname() {
        return this._realHost
    }

    get realProto() {
        return isLocalUrl(this._realHost) ? "http" : "https"
    }

    get realOrigin() {
        return `${this.realProto}://${this.realHostname}`
    }
    async joinNewsletter(email: string) {
        const result = await fetch(`${GRB_API}/${this._blog}/newsletter/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
        return result
    }

    get discordInvite() {
        return this._blog === "gregros.dev"
            ? socialUrls.discordInviteDev
            : socialUrls.discordInviteXyz
    }

    get urls() {
        return new SiteUrls(this._realHost)
    }

    async getMeta() {
        const res = await fetch(`${GRB_API}/${this._blog}/meta`)
        if (!res.ok) {
            throw new Error(`Failed to fetch blog meta: ${res.statusText}`)
        }
        const json = await res.json()
        return BlogMeta.parse(json)
    }
    async getSeries(slug: string) {
        const res = await fetch(`${GRB_API}/${this._blog}/series/${slug}`)
        if (res.status === 404) {
            notFound()
        } else if (!res.ok) {
            throw new Error(`Failed to fetch series: ${res.statusText}`)
        }
        const json = await res.json()
        return Series.parse(json)
    }

    allSeries = doddle(async () => {
        const seriesAseq = await aseq(async () => {
            const res = await fetch(`${GRB_API}/${this._blog}/series`)
            if (!res.ok) {
                routerLogger.error(
                    {
                        res: {
                            status: res.status,
                            statusText: res.statusText,
                            body: await res.json()
                        }
                    },
                    "Failed to fetch series list"
                )
                throw new Error("Failed to fetch series list")
            }
            const json = await res.json()
            return Series.array().parse(json)
        })
            .toSeq()
            .pull()

        const bySlug = seriesAseq.toMap(x => [x.slug, x]).pull()
        return bySlug
    })

    private _matchWithSeries<Format extends PostFormat>(
        posts: FormatToDto[Format][]
    ): ASeq<FormatToDoWithSeries[Format]> {
        return aseq(async () => {
            const allSeries = await this.allSeries.pull()
            return posts.map(post => {
                const postSeries = allSeries.get(post.seriesName)
                return {
                    ...post,
                    series: postSeries!
                }
            }) as any
        })
    }

    get isLocal() {
        return isLocalUrl(this._realHost)
    }

    getPosts<Format extends PostFormat>({
        format,
        series,
        limit
    }: PostSearchOptions<Format>): ASeq<FormatToDoWithSeries[Format]> {
        return aseq(async () => {
            const schema = schemas[format]
            const stringified = qs.stringify({ format, series, limit })

            const res = await fetch(`${GRB_API}/${this._blog}/posts?${stringified}`)
            if (!res.ok) {
                throw new Error(`Failed to fetch posts: ${res.statusText}`)
            }
            const json = await res.json()
            let posts = (json as FormatToDto[Format][]).map(post => schema.parse(post))
            const now = dayjs()
            posts = posts.filter(p => {
                return this.isLocal || p.published.isBefore(now)
            })
            return this._matchWithSeries(posts)
        }).cache() as any
    }

    async getPost<Format extends PostFormat>({
        slug,
        format
    }: PostGetOptions<Format>): Promise<FormatToDoWithSeries[Format]> {
        const schema = schemas[format]
        const post = await fetch(`${GRB_API}/${this._blog}/posts/${slug}?format=${format}`)

        if (post.status === 404) {
            notFound()
        }
        if (!post.ok) {
            throw new Error(`Failed to fetch post: ${post.statusText}`)
        }
        const json = await post.json()

        const parsedPost = schema.parse(json)

        const matched = await this._matchWithSeries([parsedPost]).first().pull()
        return matched as any
    }
}

function getRealHost(blog: Headers | Request) {
    return "get" in blog ? blog.get("host")! : blog.headers.get("host")!
}
function getBlogString(blog: Request | Headers | string) {
    if (typeof blog === "string") {
        return { blogName: blog, realHost: blog }
    }
    const realHost = getRealHost(blog)
    let blogName = realHost
    if (isLocalhost(blogName)) {
        throw new Error("Use hosts mapping to access locally.")
    }
    blogName = blogName.replace(".local:3001", "")

    return {
        blogName: blogName,
        realHost: realHost
    }
}
export function getBlogApi(blog: Request | Headers | string) {
    const { blogName, realHost } = getBlogString(blog)
    return new BlogApi(blogName, realHost)
}
