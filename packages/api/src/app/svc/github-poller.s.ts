import { Inject, Injectable } from "@nestjs/common"
import { Octokit } from "@octokit/rest"
import dayjs from "dayjs"
import got from "got"
import {
    catchError,
    concatMap,
    distinctUntilChanged,
    mergeMap,
    skip,
    Subscription,
    timer
} from "rxjs"
import { DATA_SOURCE } from "../dec/disk.js"
import { OCTOKIT } from "../dec/octokit.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { GitHubInfo } from "./github-info.js"
import { MyLoggerService } from "./logger.s.js"

interface GithubPoller {
    info: GitHubInfo
    sub: Subscription
}
@Injectable()
export class GithubPollerService {
    private readonly _pollers: Map<string, GithubPoller> = new Map()
    constructor(
        @Inject(OCTOKIT) private readonly _octokit: Octokit,
        private readonly _cache: PrefixedCache,
        private readonly _logger: MyLoggerService,
        @Inject(DATA_SOURCE) dataSource: string
    ) {
        this._logger.child({
            part: "GitHubPoll"
        })
        this._cache = this._cache.morePrefix("github-poll")
    }

    ensurePolling(blogId: string) {
        if (this._pollers.has(blogId)) {
            return
        }
        this._logger.log(`Starting polling for repo ${blogId}`)
        const info = new GitHubInfo(blogId)
        const poller = timer(0, 120_000)
            .pipe(
                concatMap(() => this._getHead(info)),
                catchError(err => {
                    this._logger.error(`Error polling repo ${blogId}`, {
                        error: err
                    })

                    return []
                }),
                distinctUntilChanged((a, b) => a.sha === b.sha),
                skip(1),
                mergeMap(async x => {
                    const dt = dayjs(
                        x.commit.author?.date ?? x.commit.committer?.date ?? new Date()
                    )

                    info.lastSha = x.sha

                    this._logger.warn(
                        `Repo ${blogId} updated at ${dt.format("YYYY-MM-DD HH:mm:ss")}; dropping cache`,
                        {
                            newSha: x.sha
                        }
                    )
                }),

                mergeMap(async () => {
                    await this._cache.clear()
                    await got({
                        method: "POST",
                        url: `${process.env.BOT_API}/announce`
                    }).catch(err => {
                        this._logger.error("Failed API call to announcer", {
                            error: err.message,
                            stack: err.stack
                        })
                    })
                })
            )
            .subscribe()

        this._pollers.set(blogId, {
            info,
            sub: poller
        })
    }

    private async _getHead(info: GitHubInfo) {
        const { data } = await this._octokit.rest.repos.getBranch(info.location())
        return data.commit
    }
}
