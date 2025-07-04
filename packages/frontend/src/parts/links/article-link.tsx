import { zr } from "@/zod/react"
import Link from "next/link"
import { z } from "zod"
export const PostLinkProps = z.object({
    slug: z.string(),
    children: z.any(),
    series: z.string(),
    className: z.string().optional()
})
export type PostLinkProps = z.infer<typeof PostLinkProps>
export default zr.checked(
    PostLinkProps,
    function PostLink({ slug, children, className, series }: PostLinkProps) {
        return (
            <Link href={`/${series}/${slug}`} className={className}>
                {children}
            </Link>
        )
    }
)
