import { PostListingDtoWithSeries } from "@/entities/dto/post"
import { isRaffleHit } from "@/raffle"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import DiscordInvite from "../discord-invite/discord-invite"
import PostItem from "../post-list/post-item"
import "./post-item-grid.scss"
export const PostItemGridProps = z.object({
    posts: zd.seq(PostListingDtoWithSeries),
    className: z.string().optional(),
    columns: z.number().optional(),
    hasDiscordInvites: z.boolean().optional()
})
export type PostItemGridProps = z.infer<typeof PostItemGridProps>
export default zr.checked(
    PostItemGridProps,
    function PostItemGrid({ posts, className, columns, hasDiscordInvites }: PostItemGridProps) {
        const postCount = posts.count().pull()
        let replaceIndex =
            isRaffleHit() && hasDiscordInvites ? Math.floor(Math.random() * postCount) : -1
        const discordInvite = <DiscordInvite key="discord-invite" />
        const postItems = posts
            .filter(x => !x.hidden)
            .filter(x => {
                return !x.series!.hidden
            })
            .uniq(x => x.slug)
            .map((post, i) => {
                if (i === replaceIndex) {
                    return discordInvite
                }
                return <PostItem key={post.slug} post={post} />
            })
        return (
            <ul
                className={`post-item-grid ${className ?? ""}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`
                }}
            >
                {postItems}
            </ul>
        )
    }
)
