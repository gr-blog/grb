import { createCache, type Cache } from "cache-manager"
import type React from "react"
import type { PostListingDtoWithSeries } from "./entities/dto/post"

const cache = createCache()
interface CacheData {
    rendered: React.ReactElement
    fingerprint: string
}
export type RenderType = "preview" | "full"
class PostFingerprintCache {
    private _cache: Cache
    constructor() {
        this._cache = createCache({
            ttl: 60 * 60 * 24 // Cache for 1 day
        })
    }

    private _getKey(type: RenderType, post: PostListingDtoWithSeries): string {
        return `${type}:${post.slug}`
    }

    async get(
        type: RenderType,
        post: PostListingDtoWithSeries
    ): Promise<React.ReactElement | undefined> {
        const key = this._getKey(type, post)
        let cached = await this._cache.get<CacheData>(key)
        if (!cached) {
            return undefined
        }
        if (cached.fingerprint !== post.fingerprint) {
            // Fingerprint has changed, we need to re-render
            await this._cache.del(key)
        }
        return cached.rendered
    }

    async set(type: RenderType, post: PostListingDtoWithSeries, rendered: React.ReactElement) {
        const key = this._getKey(type, post)
        const fingerprint = post.fingerprint
        const data: CacheData = {
            rendered: rendered,
            fingerprint: fingerprint
        }
        await this._cache.set(key, data)
    }
}

export const postFingerprintCache = new PostFingerprintCache()
