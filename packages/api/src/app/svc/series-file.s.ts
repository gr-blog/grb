import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import path, { basename } from "path"
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
            const slug = basename(filePath, ".yaml")

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
        return this._readFile(path.join(this._folder, `${slug.toLowerCase()}.yaml`))
    }

    private get _folder() {
        return "series"
    }

    async readAll(): Promise<SeriesFile[]> {
        const seriesFiles = await this._diskService.readDir(this._folder)
        return Promise.all(
            seriesFiles.map(async file => {
                return this._readFile(file)
            })
        )
    }
}
