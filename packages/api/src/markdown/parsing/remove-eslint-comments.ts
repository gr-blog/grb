import { doddle, seq } from "doddle"

type CommentTemplate = (x: string) => string

const regex = doddle(() => {
    const commentSuffixes = ["disable", "disable-next-line", "skip", "enable"]
    const commentPrefixes = ["eslint"]

    const templates: CommentTemplate[] = [x => `^<!-- ${x} -->\\n`]
    const alternatives = seq(commentSuffixes)
        .product([commentPrefixes, templates])
        .map(([suffix, prefix, template]) => {
            const joined = [prefix, suffix].join("-")
            return template!(joined)
        })
        .join("|")
        .map(x => new RegExp(x, "gm"))
        .pull()
    console.log(alternatives)
    return alternatives
})
export function removeEslintComments(markdown: string): string {
    // Replace ESLint comments with an empty string
    const r = regex.pull()
    return markdown.replace(r, "")
}
