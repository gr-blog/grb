import { Inject, Injectable, Scope } from "@nestjs/common"
import { VFile } from "vfile"
import { compileMdx } from "../../markdown/render-mdx/index.js"
import { BLOG_ID } from "../dec/blog.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { MyLoggerService } from "./logger.s.js"
import { PostFileService } from "./post-file.s.js"

@Injectable({
    scope: Scope.REQUEST
})
export class MdxCompilerService {
    constructor(
        @Inject(BLOG_ID) private readonly _blog: string,
        private readonly _postFileService: PostFileService,
        private readonly _logger: MyLoggerService,
        private readonly _cache: PrefixedCache
    ) {
        this._logger = this._logger.child({
            part: "MdxCompiler"
        })
    }

    async compile(prefix: string, name: string, source: string) {
        const key = `${prefix}:${name}`
        const cached = await this._cache.get<string>(key)
        if (!cached) {
            this._logger.verbose(`Rendering MDX ${key} (${source.length})`)
            const compiled = await compileMdx(
                new VFile({
                    path: name,
                    value: source,
                    data: {
                        blog: this._blog
                    }
                })
            )
            this._logger.debug(`Compiled MDX ${key} [${compiled.compiledSource.length}]`)
            const compiledSource = compiled.compiledSource as string
            await this._cache.set(key, compiledSource)
        }
        return (await this._cache.get(key)) as string
    }
}
