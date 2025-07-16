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
    }
    if (diff < 7) {
        return `${diff} days ago`
    }
    if (diff < 30) {
        return `${Math.floor(diff / 7)} weeks ago`
    }
    if (diff < 365) {
        return `${Math.floor(diff / 30)} months ago`
    }
    return `${Math.floor(diff / 365)} years ago`
}
