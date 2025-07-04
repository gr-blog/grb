import { zr } from "@/zod/react"
import React from "react"
import { z } from "zod"
import "./crumbs.scss"
import CrumbSeparator from "./separator"

export const CrumbsProps = z.object({
    children: z.any(),
    className: z.string(),
    itemClassName: z.string()
})
export type CrumbsProps = z.infer<typeof CrumbsProps>

export default zr.checked(
    CrumbsProps,
    function Crumbs({ children, className, itemClassName }: CrumbsProps) {
        const wrapped = React.Children.toArray(children).map((child, i) => (
            <li key={i} className={`crumbs__crumb ${itemClassName}`}>
                {child}
                <CrumbSeparator />
            </li>
        ))
        return (
            <nav aria-label="Breadcrumb" className={`crumbs ${className}`}>
                <ol>{wrapped}</ol>
            </nav>
        )
    }
)
