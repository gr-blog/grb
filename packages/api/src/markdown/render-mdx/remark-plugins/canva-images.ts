import { isCanvaLanguage, parseMeta } from "canva-embed-parser"
import type { Code, Root } from "mdast"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"
import { PluginList } from "../plugin.js"

export const canvaCodeBlockToExportedImage = PluginList.create([
    () => {
        return (tree: Root, file: VFile) => {
            visit(tree, "code", (node: Code, index, parent) => {
                if (!isCanvaLanguage(node.lang!)) {
                    return
                }
                const props = parseMeta<any>(node.meta!)
                let { key, format, alt, size } = props
                format ??= "webp"
                const postName = file.basename!.replace(".post.md", "")
                const blogName = file.data.blog
                parent?.children.splice(index!, 1, {
                    type: "mdxJsxFlowElement",
                    name: "div",
                    attributes: [
                        {
                            type: "mdxJsxAttribute",
                            name: "className",
                            value: "canva-image"
                        }
                    ],
                    children: [
                        {
                            type: "mdxJsxFlowElement",
                            name: "NextImage",
                            attributes: [
                                {
                                    type: "mdxJsxAttribute",
                                    name: "src",
                                    value: `####GRB_API####/${blogName}/images/${postName}/${key}?format=${format}`
                                },
                                {
                                    type: "mdxJsxAttribute",
                                    name: "alt",
                                    value: alt ?? key
                                },
                                {
                                    type: "mdxJsxAttribute",
                                    name: "width",
                                    value: size[0]
                                },
                                {
                                    type: "mdxJsxAttribute",
                                    name: "height",
                                    value: size[1]
                                }
                            ],
                            children: []
                        }
                    ]
                } as any)
            })
        }
    }
])
