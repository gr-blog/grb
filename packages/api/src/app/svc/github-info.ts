export class GitHubInfo {
    constructor(protected readonly _blog: string) {}

    lastSha: string | null = null
    location<X extends object>(rest?: X) {
        rest ??= {} as X
        return {
            ...rest,
            owner: "gr-blog",
            repo: this._blog,
            ref: "master",
            branch: "master"
        }
    }
}
