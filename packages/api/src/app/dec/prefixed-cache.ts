import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable, Scope } from "@nestjs/common"
import { Cache, Events } from "cache-manager"
import { EventEmitter } from "events"
import { BLOG_ID } from "./blog.js"
@Injectable({
    scope: Scope.REQUEST
})
export class PrefixedCache implements Cache {
    constructor(
        @Inject(CACHE_MANAGER) private readonly inner: Cache,
        @Inject(BLOG_ID) private readonly _blog: string
    ) {}

    morePrefix(prefix: string): PrefixedCache {
        return new PrefixedCache(this.inner, `${this._blog}:${prefix}`)
    }

    get blog() {
        return this._blog
    }

    private prefixed(key: string): string {
        return `${this._blog}:${key}`
    }

    async get<T>(key: string): Promise<T | null> {
        return this.inner.get<T>(this.prefixed(key))
    }

    async mget<T>(keys: string[]): Promise<Array<T | null>> {
        const prefixedKeys = keys.map(key => this.prefixed(key))
        return this.inner.mget<T>(prefixedKeys)
    }

    async ttl(key: string): Promise<number | null> {
        return this.inner.ttl(this.prefixed(key))
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<T> {
        await this.inner.set(this.prefixed(key), value, ttl)
        return value
    }

    async mset<T>(
        list: Array<{ key: string; value: T; ttl?: number }>
    ): Promise<Array<{ key: string; value: T; ttl?: number }>> {
        const prefixedList = list.map(item => ({
            ...item,
            key: this.prefixed(item.key)
        }))
        await this.inner.mset(prefixedList)
        return list
    }

    async del(key: string): Promise<boolean> {
        return this.inner.del(this.prefixed(key))
    }

    async mdel(keys: string[]): Promise<boolean> {
        const prefixedKeys = keys.map(key => this.prefixed(key))
        return this.inner.mdel(prefixedKeys)
    }

    async clear(): Promise<boolean> {
        return this.inner.clear()
    }

    on<E extends keyof Events>(event: E, listener: Events[E]): EventEmitter {
        return this.inner.on(event, listener)
    }

    off<E extends keyof Events>(event: E, listener: Events[E]): EventEmitter {
        return this.inner.off(event, listener)
    }

    async disconnect(): Promise<undefined> {
        return this.inner.disconnect()
    }

    cacheId(): string {
        return this.inner.cacheId()
    }

    get stores() {
        return this.inner.stores as any[]
    }

    wrap<T>(key: string, ...args: any[]): any {
        return (this.inner as any).wrap(this.prefixed(key), ...args)
    }
}
