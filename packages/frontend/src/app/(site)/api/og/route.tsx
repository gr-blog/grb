import { getBlogApi } from "@/api"
import { homeImage } from "@/og-image/home-image"
import { imageResponse } from "@/og-image/image-response"

export async function GET(req: Request) {
    const blog = getBlogApi(req)
    const meta = await blog.getMeta()
    return imageResponse(homeImage(meta))
}
