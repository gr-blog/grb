import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
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
        const posts = await Promise.all(
            rawSeries.posts.map(postSlug =>
                this._postFileService.get(postSlug).catch(err => {
                    if (err instanceof FileNotFoundError) {
                        const e = new InternalServerErrorException(
                            `Post "${postSlug}" in series "${rawSeries.slug}" not found.`
                        )
                        throw e
                    }
                    throw err // Re-throw other errors
                })
            )
        )
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
    async getByPost(postSlug: string): Promise<readonly [Series, number]> {
        let fromCache = await this._cache.get<readonly [Series, number]>(postSlug)
        if (!fromCache) {
            const x = await this.list()
                .map(async sName => {
                    const series = await this.get(sName)
                    const postIndex = series.posts.findIndex(post => post === postSlug)
                    if (postIndex !== -1) {
                        return [series, postIndex] as const
                    }
                    return false
                })
                .first(x => !!x)
                .pull()

            if (!x) {
                this._logger.error(`Post "${postSlug}" not found in any series.`)
                throw new Error(`Post "${postSlug}" not found in any series.`)
            }
            await this._cache.set(postSlug, x)
            fromCache = x
        }
        return fromCache!
    }
}
