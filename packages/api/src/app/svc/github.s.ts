import { Inject, Injectable, Scope } from "@nestjs/common"
import { Octokit } from "@octokit/rest"
import { dirname } from "path"
import { BLOG_ID } from "../dec/blog.js"
import { OCTOKIT } from "../dec/octokit.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { FileNotFoundError } from "../errors.js"
import { _DataService } from "./data.js"
import { GitHubInfo } from "./github-info.js"
import { GithubPollerService } from "./github-poller.s.js"
import { MyLoggerService } from "./logger.s.js"

@Injectable({
    scope: Scope.REQUEST
})
export class GithubService extends _DataService {
    get _nameForLog(): string {
        return "Github"
    }
    private _githubInfo: GitHubInfo
    constructor(
        @Inject(OCTOKIT) private readonly _octokit: Octokit,
        @Inject(BLOG_ID) private readonly _blog: string,
        _logger: MyLoggerService,
        _cache: PrefixedCache,
        private readonly _poller: GithubPollerService
    ) {
        super(_logger, _cache.morePrefix("github"))
        this._githubInfo = new GitHubInfo(this._blog)
        void this._poller.ensurePolling(this._blog)
    }

    protected _resolve(filePath: string): string {
        return filePath.replace(/\\/g, "/")
    }

    private async _readFile(filePath: string): Promise<Buffer> {
        const dir = dirname(filePath)
        if (!dir) {
            throw new FileNotFoundError(`${filePath} is not a file`)
        }
        const dirContents = await this.glob(filePath).first().pull()
        if (!dirContents) {
            throw new FileNotFoundError(`${filePath} not found in ${dir}`)
        }
        const { data } = await this._octokit.rest.repos.getContent(
            this._githubInfo.location({
                path: filePath
            })
        )
        // If you asked for a single file, GitHub returns an object, not an array.
        if (Array.isArray(data) || data.type !== "file") {
            throw new FileNotFoundError(`${filePath} is not a file`)
        }
        const buffer = Buffer.from(data.content, data.encoding as BufferEncoding)
        return buffer
    }

    protected async _readBinary(filePath: string): Promise<Buffer> {
        const buffer = await this._readFile(filePath)
        return buffer
    }

    protected async _readText(filePath: string): Promise<string> {
        const buffer = await this._readFile(filePath)
        return buffer.toString("utf-8")
    }

    protected async _readAll(): Promise<string[]> {
        const { data } = await this._octokit.git.getTree({
            owner: this._githubInfo.owner,
            repo: this._githubInfo.repo,
            tree_sha: this._githubInfo.branch,
            recursive: "true"
        })
        return data.tree.map(x => x.path)
    }
}
