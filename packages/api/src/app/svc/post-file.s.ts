import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { aseq } from "doddle"
import fm from "front-matter"
import { pick } from "lodash-es"
import path, { basename } from "path"
import { generateFingerprint, Post, PostFile, PostFm } from "../../entities/post.js"
import { createInternalLinkParser } from "../../markdown/parsing/preprocess-interlinks.js"
import { processMarkdownContents } from "../../markdown/parsing/process-markdown.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { _DataService, DATA_SERVICE } from "./data.js"
import { MyLoggerService } from "./logger.s.js"

@Injectable({
    scope: Scope.REQUEST
})
export class PostFileService {
    constructor(
        private readonly _logger: MyLoggerService,
        @Inject(DATA_SERVICE) private readonly _diskService: _DataService,
        @Inject(CACHE_MANAGER) private readonly _cache: PrefixedCache
    ) {
        this._logger = this._logger.child({
            part: "PostFile"
        })
    }

    async getInternalLinkParser() {
        return createInternalLinkParser(async target => {
            target = basename(target)
            const postPath = await this._getPathFromSlug(target)
            if (!postPath) {
                this._logger.warn(`Post with slug "${target}" not found for internal link.`)
                return undefined
            }
            return this._readBodyAndFm(postPath)
                .then(post => {
                    return post
                })
                .catch(err => {
                    this._logger.error(`Error reading post for internal link: ${target}`, {
                        error: pick(err, ["name", "message", "status", "stack"])
                    })
                    return undefined
                })
        })
    }

    private _fixPath(filePath: string) {
        filePath = filePath.replace(/\.post\.md$/, "").replace(`${this._folder}/`, "")
        return path.join(this._folder, `${filePath}.post.md`).replaceAll("\\", "/")
    }
    private _decomposePath(filePath: string): {
        seriesName: string
        slug: string
        pos: number
    } {
        const [seriesName, pos, slug] = filePath
            .replace(".post.md", "")
            .replace("posts/", "")
            .split("/")
        return { seriesName: seriesName, slug: slug, pos: +pos }
    }

    private async _readBodyAndFm(filePath: string) {
        const content = await this._diskService.readText(this._fixPath(filePath))
        const fmResult = (fm as any)(content)
        const frontmatter = PostFm.check(fmResult.attributes)
        const decomposed = this._decomposePath(filePath)
        return { content: fmResult.body, frontmatter, ...decomposed }
    }

    private async _readPostFile(filePath: string): Promise<PostFile> {
        const logger = this._logger.child({
            filePath: filePath
        })
        filePath = this._fixPath(filePath)
        let cached = await this._cache.get<PostFile>(filePath)
        if (cached) {
            return cached
        }
        const iLinkParser = await this.getInternalLinkParser()
        const { frontmatter, content } = await this._readBodyAndFm(filePath)

        let { body, excerpt, stats, toc } = processMarkdownContents(content)
        body = await iLinkParser.parse(body).value
        if (!excerpt) {
            logger.error("Body doesn't have a rule separator, which is required for excerpt!")
        }
        const { seriesName, slug, pos } = this._decomposePath(filePath)
        logger.log(`Processed post file ${filePath} (${body.length})  `, {})
        const forFingerprint = {
            title: frontmatter.title,
            published: frontmatter.published,
            updated: frontmatter.updated,
            slug: slug,
            seriesName: seriesName,
            body: body
        }
        const r = PostFile.check({
            ...forFingerprint,
            fingerprint: generateFingerprint(forFingerprint),
            path: filePath,
            pos: pos,
            title: frontmatter.title,
            hidden: frontmatter.hidden,
            slug: slug,
            headings: toc,
            excerpt,
            published: frontmatter.published,
            updated: frontmatter.updated,
            description: excerpt,
            stats: {
                readTime: stats.readTime,
                words: stats.words
            }
        })
        await this._cache.set(filePath, r) // Cache for 1 day
        return r
    }

    private get _folder() {
        return "posts"
    }

    private _listPaths() {
        return this._diskService.glob("posts/*/*/*.post.md")
    }

    private _getPathFromSlug(slug: string) {
        return this._diskService.glob(`posts/*/*/${slug}.post.md`).first().pull()
    }

    getBySeries(seriesName: string) {
        const now = dayjs()
        return this._listPaths()
            .filter(x => x.startsWith(`posts/${seriesName}/`))
            .map(x => this._readPostFile(x))
            .filter(x => x.published.isBefore(now) || x.published.isSame(now, "day"))
            .toArray()
            .pull()
    }

    list() {
        const now = dayjs()
        return aseq(async () => {
            const files = await this._listPaths().toArray().pull()

            return files.map(async file => {
                if (!file.endsWith(".post.md")) {
                    return null
                }
                return this._readPostFile(file)
            })
        })
            .filter(x => !!x)
            .map(x => x!)
            .filter(x => x.published.isBefore(now))
    }
    async get(slug: string): Promise<Post> {
        return this.list()
            .first(x => x.slug === slug)
            .map(x => {
                if (!x) {
                    throw new NotFoundException(`Post "${slug}" not found.`)
                }
                return x
            })
            .pull()
    }
}
