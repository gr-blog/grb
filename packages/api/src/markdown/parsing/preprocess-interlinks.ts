import { string } from "parjs"
import { many, map, or, then } from "parjs/combinators"
import { anyCharOrEscape, textTillCloserWithAlt } from "./parse-bracketted-notation.js"
export interface InterlinkProps {
    slug: string
    text?: string
}

export function createInternalLinkParser(getPostTitle: (slug: string) => Promise<string>) {
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
            if (x.alt != null) {
                if (!x.main.startsWith("#")) {
                    await getPostTitle(x.main)
                }
                return `[${x.alt}](/${x.main})`
            }
            if (x.main.startsWith("#")) {
                return `[${x.main.slice(1)}](${x.main})`
            }
            const title = await getPostTitle(x.main)
            return `[${title}](/${x.main})`
        }),
        or(anyCharOrEscape.pipe(map(x => Promise.resolve(x)))),
        many(),
        map(xs => Promise.all(xs).then(xs => xs.join("")))
    )
    return interLink
}
