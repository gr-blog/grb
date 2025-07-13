import { Injectable, NotFoundException } from "@nestjs/common"
import { aseq, seq } from "doddle"
import { Series, SeriesFile } from "../../entities/series.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { FileNotFoundError } from "../errors.js"
import { MyLoggerService } from "./logger.s.js"
import { PostFileService } from "./post-file.s.js"
import { SeriesFileService } from "./series-file.s.js"

@Injectable()
export class SeriesService {
    constructor(
        private readonly _logger: MyLoggerService,
        private readonly _postFileService: PostFileService,
        private readonly _seriesFileService: SeriesFileService,
        private readonly _cache: PrefixedCache
    ) {}

    private async _fillSeriesData(rawSeries: SeriesFile) {
        const posts = await aseq(() => this._postFileService.getBySeries(rawSeries.slug))
            .toArray()
            .pull()

        const postCount = posts.length
        const lastUpdatedTime = seq(posts)
            .map(p => p.updated)
            .maxBy(p => p.unix())
            .pull()

        const lastNewPostTime = seq(posts)
            .map(p => p.published)
            .maxBy(p => p.unix())
            .pull()

        const firstPostTime = seq(posts)
            .map(p => p.published)
            .minBy(p => p.unix())
            .pull()

        return Series.check({
            ...rawSeries,
            posts: posts.map(p => p.slug) as readonly string[],
            count: postCount,
            updatedTime: lastUpdatedTime,
            lastNewPost: lastNewPostTime,
            firstPostTime: firstPostTime
        })
    }

    async get(slug: string) {
        try {
            const rawSeries = await this._seriesFileService.read(slug)
            return this._fillSeriesData(rawSeries)
        } catch (err) {
            if (err instanceof FileNotFoundError) {
                this._logger.error(`Series "${slug}" not found.`, { error: err })
                throw new NotFoundException(`Series "${slug}" not found.`)
            }
            throw err // Re-throw other errors
        }
    }

    list() {
        return aseq(async () => {
            const allFiles = await this._seriesFileService.readAll()
            return allFiles.map(rawSeries => rawSeries.slug)
        })
    }
}
