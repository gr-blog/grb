import dayjs, { Dayjs } from "dayjs"
import { z } from "zod"
export const SimpleDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform(v => dayjs(v) as Dayjs)

export const zDayjs = z.custom<Dayjs>(x => {
    const r = dayjs.isDayjs(x) ? x : dayjs(x)
    if (!r) {
        throw new Error(`Not a dayjs object ${x}`)
    }
    return r
}, {})
export const Slug = z.string().regex(/^[a-z_0-9-]+$/)
export type Slug = z.infer<typeof Slug>
export const FlexDate = z
    .date()
    .transform(v => dayjs(v))
    .or(SimpleDate)
    .or(zDayjs)
    .transform(v => dayjs(v) as Dayjs)
