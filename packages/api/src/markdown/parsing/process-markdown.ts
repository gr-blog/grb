import { Heading } from "remark-extract-toc"
import { z } from "zod"
import { PostStats } from "../../entities/stats.js"
import { cutAtFirstRule } from "./cut-description.js"
import { extractTocFromMarkdown } from "./extract-toc.js"
import { ofmFootnotes } from "./ofmFootnotes.js"
import { removeEslintComments } from "./remove-eslint-comments.js"
export function calcPostStats(text: string) {
    const words = text.split(/\s+/).length
    const readTime = Math.ceil(words / 200)
    return {
        words,
        readTime
    }
}

export const ProcessedMarkdown = z.object({
    toc: z.custom<Heading[]>(),
    preview: z.string(),
    body: z.string(),
    stats: PostStats
})

export const processMarkdownContents = z
    .function()
    .args(z.string())
    .implement(markdown => {
        markdown = ofmFootnotes(markdown)
        markdown = removeEslintComments(markdown)
        const toc = extractTocFromMarkdown(markdown)
        const cut = cutAtFirstRule(markdown)
        if (typeof cut === "string") {
            var body = cut
            var excerpt = ""
        } else {
            var body = cut.after
            var excerpt = cut.before
        }
        const stats = calcPostStats(markdown)
        return {
            toc,
            excerpt,
            body,
            stats
        }
    })
