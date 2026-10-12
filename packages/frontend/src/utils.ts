import dayjs, { type Dayjs } from "dayjs"
import { humanizer } from "humanize-duration"
import slugify from "slugify"

const human = humanizer({
    units: ["y", "mo", "w", "d"],
    largest: 2,
    delimiter: " ",
    spacer: "",
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms"
        }
    }
})
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
    return human(today.diff(postDay, "ms"), { round: true }) + " ago"
}
