"use client"
import { zr } from "@/zod/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Heading } from "remark-extract-toc"
import { z } from "zod"
import "./_toc.scss"
import { observer } from "./observe-headings"

const ExtractTocHeading = z.custom<Heading>()
export const TocEntryProps = z.object({
    heading: ExtractTocHeading,
    highlighted: z.string().or(z.literal(false))
})
export type TocEntryProps = z.infer<typeof TocEntryProps>
export const TocProps = z.object({
    toc: z.array(ExtractTocHeading),
    title: z.string()
})
export type TocProps = z.infer<typeof TocProps>

export const TocEntry = zr.checked(
    TocEntryProps,
    function ({ heading, highlighted }: TocEntryProps) {
        const highlightClass = heading.slug === highlighted ? "highlighted" : undefined
        return (
            <li>
                <Link
                    href={`#${heading.slug}`}
                    className={highlightClass}
                    onClick={() => {
                        const e = document.querySelector(
                            `[id='${heading.slug}'] > a`
                        ) as HTMLElement
                        if (!e) {
                            console.error("No element found for", heading.slug)
                            return
                        }
                        e!.style.animation = ""
                        setTimeout(() => {
                            e!.style.animation = "heading-highlight 3s 1"
                        }, 1)
                    }}
                >
                    {heading.value}
                </Link>
                {heading.children.length > 0 && (
                    <ol>
                        {heading.children.map((child, i) => (
                            <TocEntry key={i} heading={child} highlighted={highlighted} />
                        ))}
                    </ol>
                )}
            </li>
        )
    }
)

export default zr.checked(TocProps, function Toc({ toc, title }: TocProps) {
    const [highlighted, setHighlighted] = useState<false | string>(false)

    const entries = toc.map(heading => (
        <TocEntry key={heading.slug} heading={heading} highlighted={highlighted} />
    ))

    useEffect(() => {
        observer.watch(heading => {
            if (heading) {
                setHighlighted(heading.id)
            }
        })
    })
    return (
        <div className="toc">
            <nav aria-label="Table of contents" className="toc__nav">
                <ol>{entries}</ol>
            </nav>
        </div>
    )
})
