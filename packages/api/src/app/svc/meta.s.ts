import { Inject, Injectable } from "@nestjs/common"
import { BlogMeta } from "../../entities/blog.js"
import { _DataService, DATA_SERVICE } from "./data.js"

@Injectable()
export class MetadataService {
    constructor(@Inject(DATA_SERVICE) private readonly _diskService: _DataService) {}
    async get() {
        const x = await this._diskService.readYaml("blog.yaml", BlogMeta)
        return x
    }
}
