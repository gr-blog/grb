import { Inject, Injectable, Scope } from "@nestjs/common"

import qs from "qs"
import { BLOG_ID } from "../dec/blog.js"

const mailingLists = {
    "gregros.dev": "72eb5324-93d9-47e2-b568-9ce3c68f753a",
    "gregros.xyz": "fdf6abaf-6d62-4b28-b212-b991682f06f0"
} as any
@Injectable({
    scope: Scope.REQUEST
})
export class MailerApiService {
    constructor(@Inject(BLOG_ID) readonly blogId: string) {}

    private get _endpoint() {
        const mailingListId = mailingLists[this.blogId]
        const base = `https://api.moosend.com/v3/subscribers/${mailingListId}/subscribe.json`
        const qString = qs.stringify({
            apiKey: process.env.API_KEY_MOOSEND
        })
        return `${base}?${qString}`
    }
    async joinNewsletter(email: string): Promise<Response> {
        const res = await fetch(this._endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                Email: email
            })
        })
        if (!res.ok) {
            throw new Error(`Failed to join newsletter: ${res.statusText}`)
        }
        return res
    }
}
