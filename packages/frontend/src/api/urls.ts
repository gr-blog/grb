import { isLocalUrl } from "./is-local-url"

export class SiteUrls {
    constructor(private readonly _realHost: string) {}

    externalUrl(args: TemplateStringsArray, ...keys: any[]) {
        const proto = isLocalUrl(this._realHost) ? "http" : "https"
        return [proto, "://", this._realHost, String.raw(args, ...keys)].join("")
    }

    post(series: string, slug: string): string {
        return this.externalUrl`/${series}/${slug}`
    }

    series(name: string): string {
        return this.externalUrl`/${name}`
    }

    postOgImage(series: string, slug: string): string {
        return this.ogImage(`/${series}/${slug}`)
    }

    home() {
        return this.externalUrl`/`
    }

    seriesOgImage(name: string): string {
        return this.ogImage(`/${name}`)
    }

    ogImage(suffix: string): string {
        return this.externalUrl`/api/og${suffix}`
    }
    homeOgImage() {
        return this.ogImage("")
    }
    rss(): string {
        return this.externalUrl`/api/rss.xml`
    }
}
