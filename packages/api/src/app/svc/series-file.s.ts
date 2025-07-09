import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import path from "path"
import { SeriesFile } from "../../entities/series.js"
import { logger } from "../../logging/index.js"
import { _DataService, DATA_SERVICE } from "./data.js"

const seriesFileLogger = logger.child({
    part: "series-file"
})
@Injectable()
export class SeriesFileService {
    constructor(@Inject(DATA_SERVICE) private readonly _diskService: _DataService) {}
    private async _readFile(filePath: string): Promise<SeriesFile> {
        try {
            const content = await this._diskService.readYaml(
                filePath,
                SeriesFile.omit({
                    slug: true
                })
            )
            const beforeLastPart = path.basename(path.dirname(filePath))
            const slug = beforeLastPart

            return {
                hidden: false,
                slug: slug,
                ...content
            }
        } catch (error: any) {
            seriesFileLogger.error(error)
            if (error.name === "FileNotFoundError") {
                throw new NotFoundException(`Series not found: ${filePath}`)
            }
            throw error // Re-throw other errors
        }
    }
    async read(slug: string): Promise<SeriesFile> {
        return this._readFile(path.join(this._folder, slug, "series.yaml"))
    }

    private get _folder() {
        return "posts"
    }

    async readAll(): Promise<SeriesFile[]> {
        const seriesFiles = await this._diskService.glob("posts/*/series.yaml").toArray().pull()
        const results = await Promise.all(
            seriesFiles.map(async file => {
                return this._readFile(file)
            })
        )
        if (results.length === 0) {
            seriesFileLogger.warn(`No series found in ${this._folder}`)
            throw new NotFoundException("No series found.")
        }
        return results
    }
}
