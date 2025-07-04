import type { BundledLanguage } from "shiki"
import { createHighlighter } from "shiki"
export default async function createShiki(...langs: BundledLanguage[]) {
    return await createHighlighter({
        themes: [],
        langs: langs,
        langAlias: {
            fortran: "fortran-fixed-form"
        }
    })
}
