import type { Root } from "hast"
import { visit } from "unist-util-visit"
import { PluginList } from "../plugin.js"

export const externalLinks = PluginList.create([
    () => {
        return (tree: Root) => {
            visit(tree, "element", node => {
                if (node.tagName === "a") {
                    const href = node.properties?.href as string
                    if (href && href.startsWith("http")) {
                        node.properties.rel = "noopener noreferrer"
                        node.properties.target = "_blank"
                    }
                }
            })
        }
    }
])
