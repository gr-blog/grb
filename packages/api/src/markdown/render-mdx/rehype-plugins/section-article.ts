import { Root } from "hast"
import { headingRank } from "hast-util-heading-rank"
import { h } from "hastscript"

export default function sectionArticle() {
    return (root: Root) => {
        let lastId: string | undefined
        let sections = []
        const currentSection = []
        for (const child of root.children) {
            if (child.type === "element" && headingRank(child)) {
                sections.push(
                    h(
                        "section",
                        {
                            "data-heading-id": lastId
                        },
                        ...currentSection
                    )
                )
                currentSection.length = 0
                lastId = child.properties?.id as string
                currentSection.push(child)
            } else {
                currentSection.push(child)
            }
        }
        if (currentSection.length > 0) {
            sections.push(
                h(
                    "section",
                    {
                        "data-heading-id": lastId
                    },
                    ...currentSection
                )
            )
        }
        root.children = sections
    }
}
