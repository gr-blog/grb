import type { HighlighterGeneric } from "shiki/core"
import rainbowBlack from "./rainbow-black-color-theme.json" with { type: "json" }
export default async function theme(highlighter: HighlighterGeneric<any, any>) {
    await highlighter.loadTheme(rainbowBlack as any)
    return highlighter
}
