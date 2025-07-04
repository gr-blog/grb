import { PostListingDtoWithSeries, PostPreviewDtoWithSeries } from "@/entities/dto/post"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { seq } from "doddle"
import { z } from "zod"
import PostItemGrid from "../post-item-grid/post-item-grid"
import PostPreview from "./post-preview"

export const PostPreviewListProps = z.object({
    previewedPosts: zd.seq(PostPreviewDtoWithSeries),
    itemPosts: zd.seq(PostListingDtoWithSeries),
    intersperse: z.number(),
    intersperseOffset: z.number(),
    chunkSize: z.number()
})

export type PostPreviewListProps = z.infer<typeof PostPreviewListProps>

export default zr.checked(
    PostPreviewListProps,
    function PostPreviewList({
        previewedPosts,
        itemPosts,
        chunkSize,
        intersperse,
        intersperseOffset
    }: PostPreviewListProps) {
        const itemPostStack = itemPosts
            .filter(post => previewedPosts.every(x => x.slug !== post.slug))
            .share()
        const postItemGrids = itemPostStack
            .chunk(chunkSize)
            .map(chunk => (
                <PostItemGrid key={`grid-${chunk[0].slug}`} posts={seq(chunk)} columns={2} />
            ))
            .cache()

        const postPreviews = previewedPosts
            .filter(x => !x.hidden)
            .filter(x => !x.series.hidden)
            .map(post => <PostPreview key={post.slug} post={post} />)
            .concatMap((preview, i) => {
                const arr = [preview]
                if (i % intersperse === intersperseOffset) {
                    arr.push(postItemGrids.at(Math.floor(i / intersperse)).pull()!)
                }

                return arr
            })
        const finalGrid = seq(() => {
            return [<PostItemGrid key="final-grid" posts={itemPostStack.cache()} columns={2} />]
        })
        return (
            <div className="post-preview-list">
                {postPreviews}
                {finalGrid}
            </div>
        )
    }
)
