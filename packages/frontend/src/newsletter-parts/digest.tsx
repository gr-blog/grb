import { type BlogApi } from "@/api"
import type { PostListingDtoWithSeries } from "@/entities/dto/post"
import { Heading, Section, Text } from "@react-email/components"
import type { Seq } from "doddle"
import type { CSSProperties } from "react"

export interface DigestBodyProps {
    posts: Seq<PostListingDtoWithSeries>
    api: BlogApi
}
export interface DigestEntryProps {
    post: PostListingDtoWithSeries
    api: BlogApi
}
const noSpacing: CSSProperties = {
    margin: 0,
    padding: 0
}
function DigestEntry({ post, api }: DigestEntryProps) {
    return (
        <Section style={{ marginTop: "20px" }}>
            <a href={api.urls.post(post.series.slug, post.slug)}>
                <Heading as="h2" style={{ ...noSpacing }}>
                    {post.title}
                </Heading>
            </a>
            <Text style={{ ...noSpacing, marginBottom: "12px" }}>
                ⮞ {post.series.title} • {post.stats.words} words • {post.stats.readTime} mins
            </Text>
            <Text style={noSpacing}>{post.description}</Text>
            <Text style={{ ...noSpacing, marginTop: "12px" }}>
                <a href={api.urls.post(post.series.slug, post.slug)}>Read more</a>
            </Text>
        </Section>
    )
}

export default async function DigestBody({ posts, api }: DigestBodyProps) {
    const digestEntries = posts
        .map(post => <DigestEntry key={post.slug} post={post} api={api} />)
        .toArray()
        .pull()

    return (
        <>
            <Heading style={{ fontSize: 35, textAlign: "center" }} as="h1">
                This week's posts at gregros.dev
            </Heading>
            <Text></Text>
            {digestEntries}
        </>
    )
}
