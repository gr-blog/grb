import { Injectable, NotFoundException } from "@nestjs/common"
import { aseq } from "doddle"
import { Post } from "../../entities/post.js"
import { PostSearchOptions } from "../dto/post.js"
import { PostFileService } from "./post-file.s.js"
import { SeriesService } from "./series.s.js"

@Injectable()
export class PostService {
    constructor(
        private readonly _postFileService: PostFileService,
        private readonly _seriesService: SeriesService
    ) {}

    async get(slug: string) {
        const post = await this._postFileService.get(slug)
        const seriesAndIndex = await this._seriesService.getByPost(slug)
        const [seriesName, pos] = seriesAndIndex
        return Post.check({
            ...post,
            series: seriesName.slug,
            pos: pos
        })
    }

    search(options: PostSearchOptions) {
        let s = aseq(async () => {
            if (options.series) {
                const series = await this._seriesService.get(options.series)
                if (!series) {
                    throw new NotFoundException(`Series "${options.series}" not found.`)
                }
                return series.posts.map(p => this.get(p))
            }
            const posts = this._postFileService.list().map(x => this.get(x.slug))
            return posts
        }).orderBy(x => [x.published.unix(), x.updated.unix(), x.pos], true)
        if (options.offset) {
            s = s.skip(options.offset)
        }
        if (options.limit) {
            s = s.take(options.limit)
        }
        return s
    }
}
