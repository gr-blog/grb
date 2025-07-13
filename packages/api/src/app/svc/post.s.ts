import { Injectable, NotFoundException } from "@nestjs/common"
import { aseq } from "doddle"
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
        return post
    }

    search(options: PostSearchOptions) {
        let s = aseq(async () => {
            if (options.series) {
                const series = await this._seriesService.get(options.series)
                if (!series) {
                    throw new NotFoundException(`Series "${options.series}" not found.`)
                }
                const posts = await this._postFileService.getBySeries(options.series)
                return posts.map(p => this.get(p.slug))
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
