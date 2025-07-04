import type { Blockquote, Root } from "mdast"
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import { rest, string } from "parjs"
import { map, qthen, then } from "parjs/combinators"
import { visit } from "unist-util-visit"
import { textTillCloserWithAlt } from "../../parsing/parse-bracketted-notation.js"
import { PluginList } from "../plugin.js"

const calloutDirective = string("![").pipe(
    qthen(textTillCloserWithAlt("]")),
    then(rest()),
    map(([x, rest]) => {
        if (Array.isArray(x)) {
            return {
                callout: x[0],
                metadata: x[1],
                text: rest
            }
        }
        return {
            callout: x,
            metadata: undefined,
            text: rest
        }
    }),
    map(x => {
        const mdxCalloutElement: MdxJsxFlowElement = {
            type: "mdxJsxFlowElement",
            name: "Callout",
            attributes: [
                {
                    type: "mdxJsxAttribute",
                    name: "type",
                    value: x.callout
                },
                {
                    type: "mdxJsxAttribute",
                    name: "metadata",
                    value: x.metadata
                }
            ],
            children: []
        }
        if (x.text) {
            mdxCalloutElement.children.push({
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        value: x.text
                    }
                ]
            })
        }

        return mdxCalloutElement
    })
)

export function tryProcessBlockQuoteAsCallout(blockquote: Blockquote) {
    const firstChild = blockquote.children[0]
    if (firstChild.type !== "paragraph") {
        return blockquote
    }
    const firstText = firstChild.children[0]
    if (firstText.type !== "text") {
        return blockquote
    }
    const content = firstText.value.trim()
    const mdxCalloutElementResult = calloutDirective.parse(content)
    if (!mdxCalloutElementResult.isOk) {
        return blockquote
    }
    const mdxCalloutElement = mdxCalloutElementResult.value
    const remaining = blockquote.children.slice(1) as any
    mdxCalloutElement.children.push(...remaining)
    return mdxCalloutElement
}

export const calloutPlugin = PluginList.create([
    () => {
        return (tree: Root) => {
            visit(tree, "blockquote", (node: Blockquote) => {
                const mdxCalloutElement = tryProcessBlockQuoteAsCallout(node)
                if (mdxCalloutElement !== node) {
                    Object.assign(node, mdxCalloutElement)
                }
            })
        }
    }
])
