import { Root } from "hast"
import { headingRank } from "hast-util-heading-rank"
import { toString } from "hast-util-to-string"
import { h } from "hastscript"
import { visit } from "unist-util-visit"
import { toSlug } from "../../../utils.js"
export const slugifyAndLink = () => {
    return (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
            if (index === undefined || parent === undefined) {
                return
            }
            const myRank = headingRank(node)
            if (myRank && !node.properties.id) {
                const slug = toSlug(toString(node))
                node.properties.id = slug
                node.children.unshift(h("i", { className: "bx bx-link bx-xs" }))
                const anchor = h(
                    "a",
                    { href: "#" + slug, className: "heading-anchor" },
                    node.children
                )
                node.children = [anchor]
            }
        })
    }
}
