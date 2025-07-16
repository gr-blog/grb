import { formatWords, mins, PostStatsDated } from "@/entities/stats"
import { daysLine } from "@/utils"
import { zr } from "@/zod/react"
import "./stats-long.scss"

export default zr.checked(PostStatsDated, function PostStatsLong(stats: PostStatsDated) {
    return (
        <ul className="post-stats-long">
            <li className="post-stats-long__date">
                <time dateTime={stats.published.toISOString()}>{daysLine(stats.published)}</time>
            </li>
            <li className="post-stats-long__words">{formatWords(stats.words)}</li>
            <li className="post-stats-long__read-time">{mins(stats.readTime)}</li>
        </ul>
    )
})
