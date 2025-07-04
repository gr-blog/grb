import rehypeKatex from "rehype-katex"
export function displayMath(macros: Record<string, string>) {
    return [rehypeKatex, { macros }]
}
