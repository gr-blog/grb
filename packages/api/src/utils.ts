import slugifyPack from "slugify"
const slugify = slugifyPack.default
export function toSlug(str: string) {
    return slugify(str.toLowerCase()).replaceAll(/['"`]/g, "")
}
