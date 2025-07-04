import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { aseq } from "doddle"
import fm from "front-matter"
import { pick } from "lodash-es"
import path, { basename } from "path"
import { PostFile, PostFm } from "../../entities/post.js"
import { createInternalLinkParser } from "../../markdown/parsing/preprocess-interlinks.js"
import { processMarkdownContents } from "../../markdown/parsing/process-markdown.js"
import { FileNotFoundError } from "../errors.js"
import { _DataService, DATA_SERVICE } from "./data.js"
import { MyLoggerService } from "./logger.s.js"

@Injectable()
export class PostFileService {
    constructor(
        private readonly _logger: MyLoggerService,
        @Inject(DATA_SERVICE) private readonly _diskService: _DataService
    ) {
        this._logger = this._logger.child({
            part: "PostFile"
        })
    }

    getInternalLinkParser() {
        return createInternalLinkParser(slug => {
            return this.readBodyAndFm(slug)
                .then(post => {
                    return post.frontmatter.title
                })
                .catch(err => {
                    this._logger.error(`Error reading post for internal link: ${slug}`, {
                        error: pick(err, ["name", "message", "status", "stack"])
                    })
                    return "???"
                })
        })
    }

    async readBodyAndFm(filePath: string) {
        filePath = filePath.replace(/\.post\.md$/, "").replace(`${this._folder}/`, "")
        const realPath = path.join(this._folder, `${filePath}.post.md`)
        const content = await this._diskService.readText(realPath)
        const fmResult = (fm as any)(content)
        const frontmatter = PostFm.check(fmResult.attributes)
        return { content: fmResult.body, frontmatter }
    }

    private async _readFile(slug: string): Promise<PostFile> {
        const iLinkParser = this.getInternalLinkParser()
        slug = basename(slug, ".post.md")
        try {
            const { frontmatter, content } = await this.readBodyAndFm(slug)

            let { body, excerpt, stats, toc } = processMarkdownContents(slug, content)
            body = await iLinkParser.parse(body).value
            if (!excerpt) {
                this._logger.error(
                    "Body doesn't have a rule separator, which is required for excerpt!"
                )
            }
            this._logger.log(`Processed post file ${slug} (${body.length})  `, {})
            return PostFile.check({
                body: body,
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
        } catch (error) {
            if (error instanceof FileNotFoundError) {
                this._logger.error(`Post "${slug}" not found at path: ${slug}`, {
                    error
                })
                throw new NotFoundException(`Post "${slug}" not found.`)
            }
            throw error // Re-throw other errors
        }
    }

    private get _folder() {
        return "posts"
    }
    list() {
        return aseq(async () => {
            const files = await this._diskService.readDir(this._folder)

            return Promise.all(
                files.map(async file => {
                    if (file.endsWith(".post.md")) {
                        return this._readFile(file)
                    }
                    return null
                })
            )
        })
            .filter(x => !!x)
            .map(x => x!)
    }
    async get(slug: string): Promise<PostFile> {
        return this._readFile(slug)
    }
}
