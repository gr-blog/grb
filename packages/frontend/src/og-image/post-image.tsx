import type { BlogApi } from "@/api"
import type { PostPreviewDtoWithSeries } from "@/entities/dto/post"
import { FiguredImage } from "./roots/figured-image"
import { UnfiguredImage } from "./roots/unfigured-image"

export async function postImage(post: PostPreviewDtoWithSeries, api: BlogApi) {
    const series = post.series
    const meta = await api.getMeta()
    const figureTrueUrl = api.resolvePlaceholderUrl(post.figure)
    if (figureTrueUrl) {
        return <FiguredImage title={post.title} figureUrl={figureTrueUrl} site={meta.title} />
    }
    return (
        <UnfiguredImage
            title={post.title}
            series={series.title}
            site={meta.title}
            seriesColor={series.color}
        />
    )
}
