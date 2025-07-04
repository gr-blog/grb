export function isLocalUrl(url: string): boolean {
    return isLocalhost(url) || url.includes(".local")
}

export function isLocalhost(url: string): boolean {
    return url.includes("localhost") || url.includes("127.0.0.1")
}
