import { mins, PostStatsDated } from "@/entities/stats"
import { daysLine } from "@/utils"
import { zr } from "@/zod/react"
import "./stats-short.scss"

export default zr.checked(
    PostStatsDated,
    function NarrowPostStats({ published, readTime }: PostStatsDated) {
        const daysAgo = daysLine(published)
        return (
            <ul className="post-stats-short">
                <li className="post-stats-short__date">
                    <time dateTime={published.toISOString()}>{daysAgo}</time>
                </li>
                <li className="post-stats-short__read-time">{mins(readTime)}</li>
            </ul>
        )
    }
)
