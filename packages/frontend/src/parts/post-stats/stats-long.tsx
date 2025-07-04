import { PostStatsDated } from "@/entities/stats"
import { zr } from "@/zod/react"
import "./stats-long.scss"

export default zr.checked(PostStatsDated, function PostStatsLong(stats: PostStatsDated) {
    return (
        <ul className="post-stats-long">
            <li className="post-stats-long__date">
                <time dateTime={stats.published.toISOString()}>
                    {stats.published.format("MMMM D, YYYY")}
                </time>
            </li>
            <li className="post-stats-long__words">{stats.words} words</li>
            <li className="post-stats-long__read-time">{stats.readTime} mins</li>
        </ul>
    )
})
