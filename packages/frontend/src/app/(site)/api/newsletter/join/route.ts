import { getBlogApi } from "@/api"
import "@/zod/exts"
import type { NextRequest } from "next/server"
import { z } from "zod"
const NewsletterRegisterPayload = z.object({
    email: z.string().email()
})
export async function POST(req: NextRequest) {
    const api = getBlogApi(req)
    const body = await req.json()
    const payload = NewsletterRegisterPayload.check(body)
    return api.joinNewsletter(payload.email)
}
