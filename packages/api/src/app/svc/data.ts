import { Cache } from "@nestjs/cache-manager"
import * as yaml from "js-yaml"
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
    protected abstract _readDir(path: string): Promise<string[]>
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

    async readDir(_origPath: string): Promise<string[]> {
        const resolved = this._resolve(_origPath)
        let fromCache = await this._cache.get<string[]>(resolved)
        if (!fromCache) {
            const files = await this._readDir(resolved)
            const fixed = files.map(file => file.replace(/\\/g, "/"))
            await this._cache.set(resolved, fixed)
            this._logger.debug(`Read directory ${_origPath} (${fixed.length})`)
            fromCache = fixed
        }
        return fromCache
    }

    async readYaml<Z extends ZodType>(filePath: string, schema: Z): Promise<Z["_output"]> {
        const raw = await this.readText(filePath)
        return schema.parse(await yaml.load(raw), {
            path: [filePath]
        })
    }
}
