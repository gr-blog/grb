import { Inject, Injectable } from "@nestjs/common"
import { _DataService, DATA_SERVICE } from "./data.js"

export interface ImageInfo {
    post: string
    key: string
    format: string
}
export interface ImageResult {
    data: Buffer
    type: string
}
@Injectable()
export class ImageService {
    constructor(@Inject(DATA_SERVICE) private readonly _diskService: _DataService) {}
    async get(info: ImageInfo): Promise<ImageResult> {
        const name = [info.post, info.key, "cnv", info.format].join(".")
        const data = await this._diskService.readBinary(`images/${name}`)
        return {
            data,
            type: `image/${info.format}`
        }
    }
}
