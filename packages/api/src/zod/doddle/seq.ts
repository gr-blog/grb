import { pull, seq, type Seq } from "doddle"
import { z, type ParseInput, type ParseReturnType, type ZodType, type ZodTypeDef } from "zod"
import type { ZodDoddleTypeName } from "./type-names.js"

export interface ZodDoddleSeqDef<T> extends ZodTypeDef {
    typeName: ZodDoddleTypeName.Seq
    eager: boolean
    element: ZodType<T>
    pathIdentifier: Seq.Iteratee<T, string>
}

export class DoddleZodSeq<T> extends z.ZodType<Seq<T>, ZodDoddleSeqDef<T>, Seq<T>> {
    _parse(value: ParseInput): ParseReturnType<Seq<T>> {
        const { data } = value
        const ctx = this._getOrReturnCtx(value)
        if (!seq.is(data)) {
            z.addIssueToContext(ctx, {
                code: z.ZodIssueCode.custom,
                message: "Input is not a Seq"
            })
            return {
                status: "aborted"
            }
        }
        const checkedSeq = data.map((v, i) => {
            const pathId = pull(this._def.pathIdentifier(v as any, i))
            const ret = this._def.element.parse(v, {
                path: [...value.path, pathId]
            })

            return ret
        })
        if (this._def.eager) {
            const cached = checkedSeq.cache()
            for (const _ of cached) {
                // noop
            }
            return {
                status: "valid",
                value: cached
            }
        }
        return {
            status: "valid",
            value: checkedSeq
        }
    }
}
