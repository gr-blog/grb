import { z, type ZodType } from "zod"

export const Heading: ZodType<Heading> = z.strictObject({
    depth: z.number(),
    slug: z.string(),
    value: z.string(),
    children: z.array(z.lazy(() => Heading))
})
export type Heading = {
    depth: number
    slug: string
    value: string
    children: Heading[]
}
