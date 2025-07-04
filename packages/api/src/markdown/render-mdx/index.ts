import { compile } from "next-mdx-remote-client/compile"
import { VFile } from "vfile"
import rehypePlugins from "./rehype-plugins/index.js"
import myKatex from "./rehype-plugins/my-katex.js"
import remarkPlugins from "./remark-plugins/index.js"
type IfNotUndef<T, Key extends keyof Exclude<T, undefined>> = Exclude<T, undefined>[Key]
type MdxOptions = IfNotUndef<Parameters<typeof compile>[1], "mdxOptions">
export async function getEvalOptions(): Promise<Parameters<typeof compile>[1]> {
    return {
        mdxOptions: {
            remarkPlugins: remarkPlugins.get(),
            rehypePlugins: myKatex.add(await rehypePlugins.pull()).get()
        }
    }
}
export async function compileMdx(vf: VFile) {
    const { compiledSource } = await compile(vf, await getEvalOptions())

    return { compiledSource: compiledSource.value }
}
