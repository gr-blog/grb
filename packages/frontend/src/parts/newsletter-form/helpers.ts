const subCookieName = "newsletter-subscribed"
export class NewsletterSub {
    constructor(
        readonly cookies: {
            get(name: string): string | undefined
            set(name: string, value: string, options?: any): void
        }
    ) {}
    get isSubscribed() {
        return !!this.cookies.get(subCookieName)
    }

    set isSubscribed(value: boolean) {
        this.cookies.set(subCookieName, `${value}`, { maxAge: 31536000, path: "/" }) // 1 year
    }
}
