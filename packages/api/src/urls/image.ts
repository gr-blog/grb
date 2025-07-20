export function getImageUrl(
    base: string,
    blogName: string,
    post: string,
    key: string,
    format: string = "webp"
) {
    return `${base}/${blogName}/images/${post}/${key}?format=${format}`
}

export function getImageUrlWithPlaceholder(
    blogName: string,
    post: string,
    key: string,
    format: string = "webp"
) {
    return getImageUrl("####GRB_API####", blogName, post, key, format)
}
