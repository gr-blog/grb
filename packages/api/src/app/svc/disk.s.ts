import { Inject, Injectable } from "@nestjs/common"
import { readFile } from "fs/promises"
import { globby } from "globby"
import { BLOG_ID } from "../dec/blog.js"
import { DATA_SOURCE, DataSource_Local } from "../dec/disk.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { FileNotFoundError } from "../errors.js"
import { _DataService } from "./data.js"
import { MyLoggerService } from "./logger.s.js"

@Injectable()
export class DiskService extends _DataService {
    get _nameForLog(): string {
        return "Disk"
    }

    constructor(
        @Inject(DATA_SOURCE) private readonly _baseDir: DataSource_Local,
        @Inject(BLOG_ID)
        private readonly _blog: string,
        _logger: MyLoggerService,
        _cache: PrefixedCache
    ) {
        super(_logger, _cache)
    }

    private get _blogSubpath(): string {
        const tld = this._blog.split(".").at(-1)
        return `${tld}/${this._blog}`
    }

    protected _resolve(filePath: string): string {
        const x = `${this._baseDir.path}/${this._blogSubpath}/${filePath}`
        return x
    }

    protected _unresolve(filePath: string): string {
        const x = filePath.replace(`${this._baseDir.path}/${this._blogSubpath}/`, "")
        return x
    }

    protected override async _readText(filePath: string): Promise<string> {
        try {
            var content = await readFile(filePath, "utf-8")
            return content
        } catch (e: any) {
            if (e.code === "ENOENT") {
                throw new FileNotFoundError(filePath)
            }
            throw e // Re-throw other errors
        }
    }

    protected override async _readAll(): Promise<string[]> {
        const resolvedGlob = this._resolve("**/*")
        const files = await globby(resolvedGlob)
        return files.map(file => this._unresolve(file))
    }

    protected override async _readBinary(filePath: string): Promise<Buffer> {
        try {
            const content = await readFile(filePath)
            return content
        } catch (e: any) {
            if (e.code === "ENOENT") {
                throw new FileNotFoundError(filePath)
            }
            throw e // Re-throw other errors
        }
    }
}
