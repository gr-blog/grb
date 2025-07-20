import { getBlogApi } from "@/api"
import { imageResponse } from "@/og-image/image-response"
import { postImage } from "@/og-image/post-image"

export async function GET(req: Request, { params: { slug } }: { params: { slug: string } }) {
    const api = getBlogApi(req)
    const post = await api.getPost({ slug, format: "preview" })
    const meta = await api.getMeta()
    return imageResponse(await postImage(post!, api))
}
