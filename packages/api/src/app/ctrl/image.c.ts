import { Controller, Get, Param, Query, StreamableFile, UseInterceptors } from "@nestjs/common"
import { CustomCacheInterceptor } from "../dec/cache-interceptor-full.js"
import { ImageService } from "../svc/image.s.js"

@UseInterceptors(CustomCacheInterceptor)
@Controller("images")
export class ImageController {
    constructor(private readonly _imageService: ImageService) {}
    @Get(":post/:key")
    async get(
        @Param("post") post: string,
        @Param("key") key: string,
        @Query("format") format: string
    ): Promise<StreamableFile> {
        const { data, type } = await this._imageService.get({ post, key, format })
        return new StreamableFile(data, { type, disposition: "inline" })
    }
}
