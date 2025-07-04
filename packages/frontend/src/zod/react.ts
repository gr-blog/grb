import { type ZodType } from "zod"

export interface ZodReactElementDef<T> {
    typeName: "ReactNode"
}

export const zr = {
    checked<Props, Factory extends (props: Props) => any>(
        schema: ZodType<Props>,
        factory: Factory
    ): Factory {
        return (args => {
            const checked = schema.parse(args)
            return factory(checked as any)
        }) as Factory
    }
}
