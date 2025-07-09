import { Cache } from "@nestjs/cache-manager"
import { ASeq, aseq } from "doddle"
import * as yaml from "js-yaml"
import { match } from "minimatch"
import { ZodType } from "zod"
import { MyLoggerService } from "./logger.s.js"

export const DATA_SERVICE = Symbol("DATA_SERVICE")
export abstract class _DataService {
    abstract get _nameForLog(): string
    constructor(
        protected readonly _logger: MyLoggerService,
        protected readonly _cache: Cache
    ) {
        this._logger = this._logger.child({
            part: (this as any)._nameForLog
        })
    }
    protected abstract _readText(path: string): Promise<string>
    protected abstract _readBinary(path: string): Promise<Buffer>
    protected abstract _readAll(): Promise<string[]>
    protected abstract _resolve(filePath: string): string
    async readText(_origPath: string): Promise<string> {
        const resolved = this._resolve(_origPath)
        let fromCache = await this._cache.get<string>(resolved)
        if (!fromCache) {
            const content = await this._readText(resolved)
            this._logger.debug(`Read ${_origPath} (${content.length})`)
            await this._cache.set(resolved, content)
            fromCache = content
        }
        return fromCache
    }

    async readBinary(_origPath: string): Promise<Buffer> {
        const resolved = this._resolve(_origPath)
        let fromCache = await this._cache.get<Buffer>(resolved)
        if (!fromCache) {
            const content = await this._readBinary(resolved)
            this._logger.debug(`Read binary ${_origPath} (${content.length})`)
            await this._cache.set(resolved, content)
            fromCache = content
        }
        return fromCache
    }

    async readAll(): Promise<string[]> {
        let fromCache = await this._cache.get<string[]>("all")
        if (!fromCache) {
            const files = await this._readAll()
            const fixed = files
                .map(file => file.replace(/\\/g, "/"))
                .map(file => file.replaceAll("./", ""))
            await this._cache.set("all", fixed)
            this._logger.debug(`Read directory recursively (${fixed.length})`)
            fromCache = fixed
        }
        return fromCache
    }

    glob(glob: string): ASeq<string> {
        return aseq(async () => {
            const all = await this.readAll()
            return match(all, glob)
        })
    }

    async readYaml<Z extends ZodType>(filePath: string, schema: Z): Promise<Z["_output"]> {
        const raw = await this.readText(filePath)
        return schema.parse(await yaml.load(raw), {
            path: [filePath]
        })
    }
}
