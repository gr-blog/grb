export class GitHubInfo {
    constructor(protected readonly _blog: string) {}

    lastSha: string | null = null
    get owner() {
        return "gr-blog"
    }

    get ref() {
        return "master"
    }

    get branch() {
        return "master"
    }

    get repo() {
        return this._blog
    }
    location<X extends object>(rest?: X) {
        rest ??= {} as X
        return {
            ...rest,
            owner: this.owner,
            repo: this.repo,
            ref: this.ref,
            branch: this.branch
        }
    }
}
