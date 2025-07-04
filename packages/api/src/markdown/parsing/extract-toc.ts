import extractToc, { type Heading } from "remark-extract-toc"
import markdown from "remark-parse"
import { unified } from "unified"
import { toSlug } from "../../utils.js"

function recursivelyAttachSlug(heading: Heading) {
    heading.slug = toSlug(heading.value)
    heading.children.forEach(recursivelyAttachSlug)
}
export function extractTocFromMarkdown(markdownString: string) {
    const processor = unified().use(markdown).use(extractToc)
    const node = processor.parse(markdownString)
    const file = processor.runSync(node)
    const headings = file as any as Heading[]
    headings.forEach(recursivelyAttachSlug)
    return headings
}
