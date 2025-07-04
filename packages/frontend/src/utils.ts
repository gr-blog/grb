import dayjs, { type Dayjs } from "dayjs"
import slugify from "slugify"

export function toSlug(str: string) {
    return slugify(str.toLowerCase()).replaceAll(/['"`]/g, "")
}
export function daysLine(date: Dayjs) {
    const today = dayjs().startOf("day")
    const postDay = date.startOf("day")
    const diff = today.diff(postDay, "day")
    switch (diff) {
        case 0:
            return "today"
        case 1:
            return "yesterday"
        default:
            return `${diff} days ago`
    }
}
