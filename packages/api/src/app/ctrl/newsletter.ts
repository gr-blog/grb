import { Body, Controller, Post, Res } from "@nestjs/common"
import type { Response as ResT } from "express" // fastify: from 'fastify'
import { createZodDto } from "nestjs-zod"
import z from "zod"
import { MailerApiService } from "../svc/mailer.s.js"

export class JoinDto extends createZodDto(
    z.object({
        email: z.string()
    })
) {
    email!: string
}
@Controller("newsletter")
export class NewsletterController {
    constructor(private readonly mailerService: MailerApiService) {}

    @Post("join")
    async joinNewsletter(
        @Body() { email }: JoinDto,
        @Res({ passthrough: false }) res: ResT // hand-roll the response
    ) {
        const upstream = await this.mailerService.joinNewsletter(email)
        res.status(upstream.status)
        for (const [name, value] of Object.entries(upstream)) {
            res.setHeader(name, value)
        }
        res.send(upstream.body)
    }
}
