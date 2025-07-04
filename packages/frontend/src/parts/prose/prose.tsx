import { GRB_API } from "@/api"
import { MdxContent } from "@/entities/dto/mdx"
import { runSync } from "next-mdx-remote-client/run"
import NextImage from "next/image"
import { z } from "zod"
import "./prose.scss"
export const ProseProps = z.object({
    content: MdxContent,
    cacheKey: z.string(),
    slug: z.string()
})

export type ProseProps = z.infer<typeof ProseProps>
export async function evaluate({
    compiledSource,
    components = {}
}: {
    compiledSource: string
    options?: Record<string, unknown>
    components?: Record<string, any>
}) {
    compiledSource = compiledSource.replaceAll("####GRB_API####", GRB_API)
    // This check is necessary otherwise "await" expression in the compiledSource throws a syntax error
    const { Content, mod } = runSync(compiledSource, {
        frontmatter: {},
        scope: {}
    })
    return <Content components={{ ...components, NextImage }} />
}
export default function Prose({ content }: ProseProps) {
    return (
        <div className="prose">
            {evaluate({
                compiledSource: content
            })}
        </div>
    )
}
