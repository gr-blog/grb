import { getBlogApi } from "@/api"
import ThankYouBody from "@/newsletter-parts/thank-you"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { Framing } from "../../framing"

export default function NewsletterRoute() {
    const api = getBlogApi(headers())
    return (
        <Framing api={api}>
            <ThankYouBody />
        </Framing>
    )
}

export function generateMetadata() {
    const api = getBlogApi(headers())
    return {
        title: `Welcome to the ${api.blogHostname} mailing list`,
        description: "What I'm about and what to expect."
    } as Metadata
}
