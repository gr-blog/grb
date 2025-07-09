import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { Octokit } from "@octokit/rest"
import dayjs from "dayjs"
import {
    catchError,
    distinctUntilChanged,
    mergeMap,
    skip,
    Subscription,
    switchMap,
    timer
} from "rxjs"
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
        @Inject(CACHE_MANAGER) private readonly _cache: PrefixedCache,
        private readonly _logger: MyLoggerService
    ) {
        this._logger.child({
            part: "GitHubPoll"
        })
    }

    ensurePolling(blogId: string) {
        if (this._pollers.has(blogId)) {
            return
        }
        this._logger.log(`Starting polling for repo ${blogId}`)
        const info = new GitHubInfo(blogId)
        const poller = timer(0, 45_000)
            .pipe(
                switchMap(() => this._getHead(info)),
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
                    await this._cache.clear()
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
