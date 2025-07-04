import { CacheInterceptor } from "@nestjs/cache-manager"
import { Injectable, Scope } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { PrefixedCache } from "./prefixed-cache.js"

export const APP_INTERCEPTOR = Symbol("APP_INTERCEPTOR")
@Injectable({
    scope: Scope.REQUEST
})
export class CustomCacheInterceptor extends CacheInterceptor {
    constructor(prefixedCache: PrefixedCache, reflector: Reflector) {
        super(prefixedCache, reflector)
    }
}
