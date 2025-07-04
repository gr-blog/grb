const ofmFootnoteRegexp = /\^\[(.*)\]/g

export function ofmFootnotes(markdownString: string) {
    const footnoteObjects = [] as { index: number; text: string }[]
    const replacedFootnotes = markdownString.replaceAll(ofmFootnoteRegexp, (match, footnote) => {
        const footnoteIndex = footnoteObjects.length + 1
        footnoteObjects.push({
            index: footnoteIndex,
            text: footnote
        })
        return `<sup>[${footnoteIndex}]</sup>`
    })
    const footnoteLines = footnoteObjects.map(footnote => {
        return `[${footnote.index}]: ${footnote.text}`
    })
    return `${replacedFootnotes}\n\n${footnoteLines.join("\n")}`
}
