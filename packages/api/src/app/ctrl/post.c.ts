import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common"
import { CustomCacheInterceptor } from "../dec/cache-interceptor-full.js"
import {
    PostAnnounceDto,
    PostFullDto,
    PostListingDto,
    PostPreviewDto,
    PostSearchOptionsDto,
    type PostFormat
} from "../dto/post.js"
import { MdxCompilerService } from "../svc/mdx.s.js"
import { PostService } from "../svc/post.s.js"
@UseInterceptors(CustomCacheInterceptor)
@Controller("posts")
export class PostsController {
    constructor(
        private readonly _postService: PostService,
        private readonly _mdxCompilerService: MdxCompilerService
    ) {}

    private _getFunction(format: PostFormat) {
        switch (format) {
            case "preview":
                return this._getPostPreview.bind(this)
            case "listing":
                return this._getPostListing.bind(this)
            case "full":
                return this._getPostFull.bind(this)
            case "announce":
                return this._getPostAnnounce.bind(this)
            default:
                throw new Error(`Unknown post format: ${format}`)
        }
    }

    @Get(":slug")
    async get(@Param("slug") slug: string, @Query("format") format: PostFormat = "full") {
        const f = this._getFunction(format)
        return f(slug)
    }

    private async _getPostPreview(slug: string) {
        const obj = await this._postService.get(slug)
        const rendered = await this._mdxCompilerService.compile("preview", obj.slug, obj.excerpt)
        return PostPreviewDto.check({
            ...obj,
            excerpt: rendered
        })
    }

    private async _getPostListing(slug: string) {
        const obj = await this._postService.get(slug)
        return PostListingDto.check({
            ...obj
        })
    }

    private async _getPostAnnounce(slug: string) {
        const obj = await this._postService.get(slug)
        return PostAnnounceDto.check(obj)
    }

    private async _getPostFull(slug: string) {
        const obj = await this._postService.get(slug)
        const rendered = await this._mdxCompilerService.compile("full", obj.slug, obj.body)
        return PostFullDto.check({
            ...obj,
            body: rendered
        })
    }

    @Get()
    async list(@Query() options: PostSearchOptionsDto) {
        const f = this._getFunction(options.format)
        const posts = this._postService.search(options)
        return posts
            .map(async p => f(p.slug))
            .toArray()
            .pull()
    }
}
