import { getBlogApi } from "@/api"
import { imageResponse } from "@/og-image/image-response"
import { seriesImage } from "@/og-image/series-image"

export async function GET(req: Request, { params: { name } }: { params: { name: string } }) {
    const api = getBlogApi(req)
    const series = await api.getSeries(name)
    const meta = await api.getMeta()
    return imageResponse(seriesImage(series, meta))
}
