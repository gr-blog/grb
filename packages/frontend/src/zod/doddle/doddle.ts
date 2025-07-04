import { doddle, type Doddle } from "doddle"
import { z, type ParseInput, type ParseReturnType, type ZodType, type ZodTypeDef } from "zod"
import type { ZodDoddleTypeName } from "./type-names"

export interface ZodDoddleDoddleDef<T> extends ZodTypeDef {
    typeName: ZodDoddleTypeName.Doddle
    element: ZodType<T>
}

export class DoddleZodDoddle<T> extends z.ZodType<Doddle<T>, ZodDoddleDoddleDef<T>, Doddle<T>> {
    _parse(value: ParseInput): ParseReturnType<Doddle<T>> {
        const { data } = value
        const ctx = this._getOrReturnCtx(value)
        if (!doddle.is(data)) {
            z.addIssueToContext(ctx, {
                code: z.ZodIssueCode.custom,
                message: "Input is not a Doddle"
            })
            return {
                status: "aborted"
            }
        }
        const checkedDoddle = data.map(v => {
            const ret = this._def.element.parse(v, {
                path: [...value.path]
            })

            return ret
        })

        return {
            status: "valid",
            value: checkedDoddle as Doddle<T>
        }
    }
}
