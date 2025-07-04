import { zr } from "@/zod/react"
import Link from "next/link"
import { z } from "zod"
import Logo from "./logo"
import "./page-header.scss"
import "./sticky-top-nav.scss"
export const PageHeaderProps = z.object({
    children: z.any(),
    className: z.string().optional()
})
export type PageHeaderProps = z.infer<typeof PageHeaderProps>
export default zr.checked(
    PageHeaderProps,
    function PageHeader({ children, className }: PageHeaderProps) {
        return (
            <header className={`page-header ${className ?? ""}`}>
                <div className="page-header__logo">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
                <div className={`page-header__main`}>{children}</div>
            </header>
        )
    }
)
