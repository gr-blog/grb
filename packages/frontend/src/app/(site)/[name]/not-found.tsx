"use client"
import PageError from "@/parts/page-error"
import { useParams } from "next/navigation"

export default function PostPage() {
    const { slug } = useParams()

    if (slug.includes(".map")) {
        return <div>404</div>
    }
    return <PageError message={`Series "${slug}" not found`} status={404} />
}
