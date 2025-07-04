import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import dayjs, { Dayjs } from "dayjs"
import { aseq, type ASeq } from "doddle"
import type { Message } from "oceanic.js"
import type EnvConfig from "../../env.js"
import { DiscordBotError } from "../../error.js"
import { DiscordClientService } from "../client.mod/discord-client.svc.js"
import { DISCORD_CLIENT } from "../client.mod/import-token.js"
import { MyLoggerService } from "../logger.s.js"

const DATE_FMT = "YYYY-MM-DD"

export interface PostEntry {
    host: string
    slug: string
    date: Dayjs
}

export interface BlogInfo {
    host: string
    dataChannelName: keyof EnvConfig
    announcerSymbol: symbol
}

export const BLOG_INFO = Symbol("BLOG_INFO")
@Injectable()
export class AdvertDbService {
    constructor(
        private readonly _logger: MyLoggerService,
        @Inject(DISCORD_CLIENT) private readonly _api: DiscordClientService,
        private readonly _config: ConfigService<EnvConfig>,
        @Inject(BLOG_INFO)
        private readonly _options: BlogInfo
    ) {
        this._logger = this._logger.child({
            part: "ad-db",
            host: this._options.host
        })
    }

    get hostname() {
        return this._options.host
    }

    private get _channelId() {
        return this._config.getOrThrow(this._options.dataChannelName)
    }

    private get _header() {
        return this._config.getOrThrow("DB_ENTRY_HEADER")
    }

    private _encode(entry: PostEntry): string {
        const dateStr = entry.date.format(DATE_FMT)
        return [this._header, entry.host, entry.slug, dateStr].join(",")
    }

    private _decode(msg: Message): PostEntry {
        if (msg.author.id !== this._api.currentUser.id) {
            throw new DiscordBotError("Message author is not the bot itself")
        }
        if (!msg.content.startsWith(this._header)) {
            throw new DiscordBotError("Message content does not start with the expected header")
        }

        const [, host, slug, dateStr] = msg.content.split(",")
        if (!host) {
            throw new DiscordBotError("Message does not contain a host")
        }
        if (host !== this._options.host) {
            throw new DiscordBotError(`Host "${host}" is not the allowed hostname`)
        }
        if (!slug) {
            throw new DiscordBotError("Message does not contain a slug")
        }
        if (!dateStr) {
            throw new DiscordBotError("Message does not contain a date")
        }

        const date = dayjs(dateStr, DATE_FMT)
        if (!date.isValid()) {
            throw new DiscordBotError(`Invalid date format: "${dateStr}"`)
        }

        return { host, slug, date }
    }

    readLast(count: number): ASeq<PostEntry> {
        return aseq(async () => {
            let messages = await this._api.channels.getMessages(this._channelId, {
                limit: count
            })

            const entries: PostEntry[] = []
            messages = messages.filter(m => m.content.startsWith(this._header))
            for (const m of messages) {
                entries.push(this._decode(m))
                if (entries.length >= count) {
                    break
                }
            }
            this._logger.verbose(`Read ${entries.length} PostEntries from channel`)
            return entries
        }).cache()
    }

    async append(entry: PostEntry): Promise<void> {
        const content = this._encode(entry)
        await this._api.channels.createMessage(this._channelId, {
            content,
            allowedMentions: {
                everyone: false,
                users: false,
                roles: false
            }
        })
        this._logger.verbose("Appended PostEntry", { host: entry.host, slug: entry.slug })
    }
}
