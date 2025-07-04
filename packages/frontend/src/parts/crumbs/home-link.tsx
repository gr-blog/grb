import { zr } from "@/zod/react"
import Link from "next/link"
import { z } from "zod"
import Logo from "../headers/logo"
import "./home-link.scss"

export const HomeLinkProps = z.object({
    children: z.any().optional()
})

export type HomeLinkProps = z.infer<typeof HomeLinkProps>

export default zr.checked(HomeLinkProps, function HomeLink({ children }: HomeLinkProps) {
    return (
        <Link href="/" className="home-link">
            <Logo className="home-link__logo" />
            <span className="home-link__text">{children || "GregRos"}</span>
        </Link>
    )
})
