import { Octokit } from "@octokit/rest"

export const OCTOKIT = Symbol("Octokit")

export function createOctokit(): Octokit {
    return new Octokit({
        auth: process.env.GITHUB_TOKEN
    })
}
