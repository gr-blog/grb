import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { Dayjs } from "dayjs"
import { Embed } from "oceanic.js"
import { type EnvOptions } from "../../env.js"
import { rootLogger } from "../../logging/index.js"
import { DiscordClientService } from "./discord-client.svc.js"
import { DISCORD_CLIENT } from "./import-token.js"

export interface AnnouncePost {
    blog: {
        hostname: string
        url: string
    }
    url: string
    series: {
        title: string
        url: string
        color: string
    }
    published: Dayjs
    title: string
    description: string
    cover: string
}
const code = (str: string) => `\`${str}\``
const b = (str: string) => `**${str}**`
const i = (str: string) => `*${str}*`
const link = (text: string, url: string) => `[${text}](${url})`
@Injectable()
export class SendAdvertService {
    constructor(
        @Inject(DISCORD_CLIENT)
        private readonly _client: DiscordClientService,
        private readonly _config: ConfigService<EnvOptions>
    ) {
        const a = 1
    }

    private _formatContent(post: AnnouncePost): string {
        return `
        New ${b(post.blog.hostname)} post just dropped! Check it out!
`
    }

    private _oldFormatContent(post: AnnouncePost): string {
        return `
New ${b(post.blog.hostname)} post just dropped!

${b(link(post.series.title, post.series.url))} ➤ ${b(link(post.title, post.url))}
`.trim()
    }

    private _formatEmbed(post: AnnouncePost): Embed {
        const firstLine = i(
            `A new post in the ${b(link(post.series.title, post.series.url))} series at ${b(link(post.blog.hostname, post.blog.url))}!`
        )
        return {
            title: `🆕 ${post.title}`,
            description: `${firstLine}\n\n${post.description}`,
            color: parseInt(post.series.color.replace("#", "0x"), 16),
            image: {
                url: post.cover
            },
            url: post.url,
            timestamp: post.published.toISOString().split("T")[0] + "T00:00:00Z" // Use only the date part for the timestamp
        }
    }

    async advertise(post: AnnouncePost): Promise<void> {
        await this._client.channels.createMessage(this._config.getOrThrow("CHANNEL_ID_ANNOUNCE"), {
            allowedMentions: {
                everyone: true
            },
            embeds: [this._formatEmbed(post)]
        })
        rootLogger.info("Announced post", { url: post.url })
    }
}
