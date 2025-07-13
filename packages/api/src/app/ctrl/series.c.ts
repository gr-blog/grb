import { Controller, Get, Param, UseInterceptors } from "@nestjs/common"
import { CustomCacheInterceptor } from "../dec/cache-interceptor-full.js"
import { SeriesService } from "../svc/series.s.js"

@UseInterceptors(CustomCacheInterceptor)
@Controller("series")
export class SeriesController {
    constructor(private readonly _seriesService: SeriesService) {}

    @Get()
    async list() {
        return this._seriesService
            .list()
            .map(s => this._seriesService.get(s))
            .filter(s => s.count > 0)
            .toArray()
            .pull()
    }

    @Get(":slug")
    async get(@Param("slug") slug: string) {
        return this._seriesService.get(slug)
    }
}
