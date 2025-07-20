import { Inject, Injectable, UseInterceptors } from "@nestjs/common"
import sharp from "sharp"
import { CustomCacheInterceptor } from "../dec/cache-interceptor-full.js"
import { _DataService, DATA_SERVICE } from "./data.js"
export interface ImageInfo {
    post: string
    key: string
    format: string
    share?: boolean
}
export interface ImageResult {
    data: Buffer
    type: string
}
@UseInterceptors(CustomCacheInterceptor)
@Injectable()
export class ImageService {
    constructor(@Inject(DATA_SERVICE) private readonly _diskService: _DataService) {}
    async get(info: ImageInfo): Promise<ImageResult> {
        const name = [info.post, info.key, info.share ? "share" : undefined, "cnv", "webp"]
            .filter(x => !!x)
            .join(".")
        let data = await this._diskService.readBinary(`images/${name}`)
        if (info.format === "png") {
            data = await sharp(data).png().toBuffer()
        }
        return {
            data,
            type: `image/${info.format}`
        }
    }
}
