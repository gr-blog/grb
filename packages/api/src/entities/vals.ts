import dayjs, { Dayjs } from "dayjs"
import { z } from "zod"

export const zDayjs = z.custom<Dayjs>(x => {
    const r = dayjs.isDayjs(x) ? x : dayjs(x)
    if (!r) {
        throw new Error(`Not a dayjs object ${x}`)
    }
    return r
}, {})
export const zDayjsLike = zDayjs.or(
    z
        .string()
        .or(z.number())
        .transform(v => dayjs(v))
        .refine(x => {
            return dayjs.isDayjs(x) && x.isValid()
        })
)

export const Slug = z.string().regex(/^[a-z_0-9-]+$/)
export type Slug = z.infer<typeof Slug>
