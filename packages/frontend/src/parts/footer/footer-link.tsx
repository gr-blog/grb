import { zr } from "@/zod/react"
import Link from "next/link"
import { z } from "zod"
import "./footer-link.scss"

export const FooterLinkProps = z.object({
    text: z.string(),
    name: z.string(),
    href: z.string(),
    openInNewTab: z.boolean().optional(),
    me: z.boolean().optional()
})

export type FooterLinkProps = z.infer<typeof FooterLinkProps>

export default zr.checked(
    FooterLinkProps,
    function FooterLink({ text, href, name, openInNewTab, me }: FooterLinkProps) {
        return (
            <Link
                href={href}
                className="footer-link"
                data-where={name}
                rel={me ? "me" : undefined}
                target={openInNewTab ? "_blank" : undefined}
            >
                {text}
            </Link>
        )
    }
)
