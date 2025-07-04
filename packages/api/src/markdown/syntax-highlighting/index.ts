import rehypeShikiFromHighlighter, { type RehypeShikiCoreOptions } from "@shikijs/rehype/core"
import { doddle } from "doddle"
import create from "./create.js"
import theme from "./theme.js"
import transformers from "./transformers/index.js"
export default doddle(async () => {
    const highlighter = await create(
        "typescript",
        "tsx",
        "javascript",
        "css",
        "html",
        "fsharp",
        "json",
        "markdown",
        "fortran-fixed-form",
        "c",
        "cpp"
    )
    await theme(highlighter)
    return function (this: any, options: RehypeShikiCoreOptions) {
        return rehypeShikiFromHighlighter.call(this, highlighter, {
            ...options,
            theme: "rainbow-black",
            addLanguageClass: true,
            transformers
        })
    }
})
