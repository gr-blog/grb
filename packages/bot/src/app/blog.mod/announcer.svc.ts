import { Inject, Injectable } from "@nestjs/common"
import dayjs from "dayjs"
import parseDuration from "parse-duration"
import { DiscordBotError } from "../../error.js"
import { AnnouncePost, SendAdvertService } from "../client.mod/sender.svc.js"
import { getBlogApi } from "../grb-api/index.js"
import { MyLoggerService } from "../logger.s.js"
import { AdvertDbService } from "./advert-db.js"

export type AnnounceType = "interval" | "push" | "manual"
export const ANNOUNCE_CUTOFF = Symbol("ANNOUNCE_CUTOFF")
@Injectable()
export class AnnouncerService {
    constructor(
        private readonly _logger: MyLoggerService,
        private readonly _sender: SendAdvertService,
        private readonly _db: AdvertDbService,
        @Inject(ANNOUNCE_CUTOFF) private readonly _announceCutoffDuration: string
    ) {
        this._logger = this._logger.child({
            part: "announcer",
            host: this._db.hostname
        })
    }

    private _announced = 0

    async announcePosts(type: AnnounceType) {
        const logger = this._logger.child({
            call: `#${++this._announced}`,
            type
        })

        logger.log(`Received announce call of ${type} with ${this._announceCutoffDuration}`, {
            type,
            cutoff: this._announceCutoffDuration
        })
        const cutoffMs = parseDuration(this._announceCutoffDuration)
        if (!cutoffMs) {
            throw new DiscordBotError(`Invalid cutoff duration: ${this._announceCutoffDuration}`)
        }
        const cutoffDate = dayjs().subtract(cutoffMs, "ms")
        const blogApi = getBlogApi(this._db.hostname)
        let posts = await blogApi
            .getPosts({
                count: 15,
                after: cutoffDate.unix()
            })
            .toArray()
            .pull()
        logger.debug("Fetched posts", {
            posts: posts.map(post => post.slug)
        })
        let knownAds = await this._db.readLast(10).toArray().pull()

        logger.debug("Fetched ads", {
            ads: knownAds.map(ad => ad.slug)
        })
        posts = posts.filter(post => dayjs(post.published).isAfter(cutoffDate))
        logger.debug("Filtered posts after cutoff", {
            posts: posts.map(post => ({
                slug: post.slug
            }))
        })
        let postsToAnnounce = posts.filter(post => knownAds.every(ad => ad.slug !== post.slug))
        if (postsToAnnounce.length === 0) {
            logger.log("No new posts to announce")
        } else {
            logger.log(`Found ${postsToAnnounce.length} new posts to announce.`, {
                posts: postsToAnnounce.map(post => post.slug)
            })
        }
        postsToAnnounce.sort((a, b) => a.published.diff(b.published))
        for (const post of postsToAnnounce) {
            const postUrl = blogApi.urls.post(post.series.slug, post.slug)
            const postCover = blogApi.urls.postOgImage(post.series.slug, post.slug)
            const postData: AnnouncePost = {
                blog: {
                    hostname: this._db.hostname,
                    url: blogApi.urls.home()
                },
                url: postUrl,
                published: post.published,
                title: post.title,
                description: post.description,
                cover: postCover,
                series: {
                    color: post.series.color,
                    title: post.series.title,
                    url: blogApi.urls.series(post.series.slug)
                }
            }
            this._logger.verbose("Sending advert to discord", {
                postData
            })
            await this._sender.advertise(postData)
            this._logger.verbose("Appending post to database", {
                ...postData,
                published: post.published.format("YYYY-MM-dd")
            })
            await this._db.append({
                slug: post.slug,
                date: post.published,
                host: this._db.hostname
            })
        }
    }
}
