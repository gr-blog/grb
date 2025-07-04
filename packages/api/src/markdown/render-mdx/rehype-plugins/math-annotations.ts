import { Root, Text } from "hast"
import { visit } from "unist-util-visit"
import { z } from "zod"
const delimeter = ";;"
const zMathProps = z.object({
    style: z.enum(["hidden", "big"]).optional(),
    className: z.string().optional(),
    id: z.string().optional()
})
export interface KnownProps {
    style?: "hidden" | "big"
    [key: string]: string | undefined
}

function parseProps(line: string): KnownProps {
    if (!line.startsWith("%!")) {
        return {}
    }
    line = line.slice(2)
    const kvps = line.split(delimeter)
    const result: Record<string, string> = {}
    for (const kvp of kvps) {
        const [key, value] = kvp.split("=")
        result[key.trim()] = value.trim()
    }
    return zMathProps.parse(result)
}
export const mathAnnotations = () => {
    return (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
            if (node.tagName === "annotation") {
                const textNode = node.children[0] as Text
                const textContents = textNode.value
                const firstLine = textContents.split("\n")[0]
                const props = parseProps(firstLine)
                if (props.style) {
                    node.properties["data-style"] = props.style
                }
            }
        })
    }
}
