declare module "remark-extract-toc" {
    export type Heading = {
        depth: number
        value: string
        slug: string
        children: Heading[]
    }
    let extractToc: any
    export default extractToc
}
