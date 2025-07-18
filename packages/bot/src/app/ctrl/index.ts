import { Controller, Inject, Post, Query } from "@nestjs/common"
import { lastValueFrom, mergeMap, timer } from "rxjs"
import { BLOG_DEV, BLOG_XYZ } from "../blog-symbols.js"
import { AnnouncerService } from "../blog.mod/announcer.svc.js"

@Controller("announce")
export class AnnounceController {
    constructor(
        @Inject(BLOG_DEV) private readonly _devAnnouncer: AnnouncerService,
        @Inject(BLOG_XYZ)
        private readonly _xyzAnnouncer: AnnouncerService
    ) {}

    @Post()
    async announce(@Query("type") type: string) {
        await this._devAnnouncer.announcePosts(type as any)
        await this._xyzAnnouncer.announcePosts(type as any)
    }

    async announceCycle() {
        await lastValueFrom(
            timer(0, 10 * 60 * 1000).pipe(
                mergeMap(() => {
                    return this.announce("interval")
                })
            )
        )
    }
}
