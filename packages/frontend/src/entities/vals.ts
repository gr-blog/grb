import dayjs, { Dayjs } from "dayjs"
import { z } from "zod"

delete (dayjs.prototype as any).toJSON
export const zDayjs = z.custom<Dayjs>(
    x => {
        const r = dayjs.isDayjs(x)

        return r
    },
    {
        fatal: true
    }
)

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
