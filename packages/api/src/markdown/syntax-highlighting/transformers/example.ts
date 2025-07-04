import { seq } from "doddle"
import type { ThemedToken } from "shiki"
import classifier from "./js-token-classifier.js"
import { shikiTransformerList } from "./list.js"
const symbolsRegex =
    /^(?<startingSymbols>[^a-zA-Z0-9_]+)(?<ident>\w+)(?<endingSymbols>[^a-zA-Z0-9_]+)$/g
function splitToken(tk: ThemedToken) {
    const result = symbolsRegex.exec(tk.content)
    if (!result) return [tk]
    const { startingSymbols, ident, endingSymbols } = result.groups!
    const starting = startingSymbols.length ? [{ ...tk, content: startingSymbols }] : []
    const middle = [{ ...tk, content: ident, offset: tk.offset + startingSymbols.length }]
    const ending = endingSymbols.length
        ? [
              {
                  ...tk,
                  content: endingSymbols,
                  offset: tk.offset + startingSymbols.length + ident.length
              }
          ]
        : []
    return starting.concat([{ ...tk, content: ident }], ending)
}
const langs = ["typescript", "javascript", "tsx", "jsx"]
export default shikiTransformerList({
    name: "color-by-name",
    tokens(lineTokens) {
        if (!langs.includes(this.options.lang)) {
            return lineTokens
        }
        // split meaningfully named tokens from inside symbols
        const meaningful = seq(lineTokens)
            .map(tokens => {
                return seq(tokens)
                    .concatMap(token => {
                        return splitToken(token)
                    })
                    .toArray()
            })
            .toArray()
            .pull()
        return meaningful
    },
    span(node) {
        const cls = classifier.pull()
        const { children } = node
        if (children.length !== 1 || children[0].type !== "text") {
            console.log("unexpected node", node)
            return node
        }
        const text = children[0].value
        const byName = cls(text)
        if (byName) {
            const className = `token-${byName}`
            this.addClassToHast(node, className)
        }
    }
})
