import { Controller, Get, UseInterceptors } from "@nestjs/common"
import { CustomCacheInterceptor } from "../dec/cache-interceptor-full.js"
import { MetadataService } from "../svc/meta.s.js"
@UseInterceptors(CustomCacheInterceptor)
@Controller("meta")
export class MetadataController {
    constructor(private readonly _metadataService: MetadataService) {}
    @Get()
    get() {
        return this._metadataService.get()
    }
}
