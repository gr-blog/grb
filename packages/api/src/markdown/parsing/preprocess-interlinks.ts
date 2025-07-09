import { string } from "parjs"
import { many, map, or, then } from "parjs/combinators"
import { anyCharOrEscape, textTillCloserWithAlt } from "./parse-bracketted-notation.js"
export interface InterlinkProps {
    slug: string
    text?: string
}

export function createInternalLinkParser(
    getPost: (target: string) => Promise<
        | {
              slug: string
              seriesName: string
              frontmatter: {
                  title: string
              }
          }
        | undefined
    >
) {
    const embed = string("![[").pipe(map(x => "embed"))
    const link = string("[[").pipe(map(x => "link"))
    const embedOrLink = embed.pipe(or(link))
    const interLink = embedOrLink.pipe(
        then(textTillCloserWithAlt("]]")),
        map(async ([type, x]) => {
            if (type === "embed") {
                return `![${x.alt}](/${x.main})`
            }
            if (x.main.includes(".post")) {
                x.main = `${x.main.replace(".post", "")}`
            }
            if (x.main.startsWith("#")) {
                if (x.alt != null) {
                    return `[${x.alt}](${x.main})`
                }
                return `[${x.main.slice(1)}](${x.main})`
            }
            const post = await getPost(x.main)
            if (!post) {
                return `[[${x.main}]]`
            }
            const linkText = x.alt ?? post.frontmatter.title
            const linkTarget = `/${post.seriesName}/${post.slug}`
            return `[${linkText}](${linkTarget})`
        }),
        or(anyCharOrEscape.pipe(map(x => Promise.resolve(x)))),
        many(),
        map(xs => Promise.all(xs).then(xs => xs.join("")))
    )
    return interLink
}
