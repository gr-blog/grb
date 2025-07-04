import { aseq, doddle, pull, type ASeq, type Seq } from "doddle"
import { z, type ParseInput, type ParseReturnType, type ZodType, type ZodTypeDef } from "zod"
import type { ZodDoddleTypeName } from "./type-names"

export interface ZodDoddleASeqDef<T> extends ZodTypeDef {
    typeName: ZodDoddleTypeName.ASeq
    eager: boolean
    element: ZodType<T>
    pathIdentifier: Seq.Iteratee<T, string>
}

export class DoddleZodASeq<T> extends z.ZodType<ASeq<T>, ZodDoddleASeqDef<T>, ASeq<T>> {
    _parse(value: ParseInput): ParseReturnType<ASeq<T>> {
        const { data } = value
        const ctx = this._getOrReturnCtx(value)
        if (!aseq.is(data)) {
            z.addIssueToContext(ctx, {
                code: z.ZodIssueCode.custom,
                message: "Input is not a ASeq"
            })
            return {
                status: "aborted"
            }
        }
        const checkedASeq = data.map((v, i) => {
            const pathId = pull(this._def.pathIdentifier(v as any, i))
            const ret = this._def.element.parse(v, {
                path: [...value.path, pathId]
            })

            return ret
        })
        if (this._def.eager && ctx.common.async) {
            const cached = checkedASeq.cache()
            return doddle(async () => {
                for await (const _ of cached) {
                    // noop
                }
                return {
                    status: "valid" as const,
                    value: cached
                }
            }).pull()
        }
        const ret = {
            status: "valid",
            value: checkedASeq
        }
        if (ctx.common.async) {
            return doddle(async () => ret).pull() as any
        }
        return ret as any
    }
}
