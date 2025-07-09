import { LoggerService } from "@nestjs/common"
import got from "got"

export interface AnnouncePost {
    slug: string
    [key: string]: unknown
}

export class Prewarmer {
    constructor(
        private readonly logger: LoggerService,
        private readonly baseUrl: string = "http://localhost:3000",
        private readonly blogs: readonly string[] = ["gregros.dev", "gregros.xyz"]
    ) {}

    /** Warm the series endpoint and every post for a given blog. */
    private async _prewarmBlog(blogName: string): Promise<void> {
        this.logger.log(`Warm series → ${blogName}/series`)
        await got(`${this.baseUrl}/${blogName}/series`)

        this.logger.log(`Fetch announce list → ${blogName}/posts?format=announce`)
        const posts = (await got(`${this.baseUrl}/${blogName}/posts`, {
            searchParams: { format: "announce" }
        }).json()) as AnnouncePost[]

        for (const { slug } of posts) {
            if (slug) {
                await this._prewarmPost(`${blogName}/posts/${slug}`)
            }
        }
    }

    /** Warm a single post path; expects blog‑relative path (e.g. "gregros.dev/posts/foo"). */
    private async _prewarmPost(postPath: string): Promise<void> {
        this.logger.log(`Warm post → ${postPath}`)
        await got(`${this.baseUrl}/${postPath}`)
    }

    /** Warm all configured blogs sequentially. */
    async prewarm(): Promise<void> {
        for (const blog of this.blogs) {
            await this._prewarmBlog(blog)
        }
    }
}
