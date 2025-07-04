import type { Seq } from "doddle"
import type { ZodType } from "zod"
import { DoddleZodASeq } from "./aseq.js"
import { DoddleZodDoddle } from "./doddle.js"
import { DoddleZodSeq } from "./seq.js"
import { ZodDoddleTypeName } from "./type-names.js"

const knownPathIds = new Map<ZodType<any>, Seq.Iteratee<any, string>>()
export const zd = {
    setPathId(schema: ZodType<any>, pathId: Seq.Iteratee<any, string>) {
        knownPathIds.set(schema, pathId)
    },
    seq: <T>(element: ZodType<T>, pathId?: Seq.Iteratee<T, string>) => {
        return new DoddleZodSeq({
            typeName: ZodDoddleTypeName.Seq,
            eager: false,
            element,
            pathIdentifier: pathId ?? knownPathIds.get(element) ?? ((v, i) => `${i}`)
        })
    },
    aseq: <T>(element: ZodType<T>, pathId?: Seq.Iteratee<T, string>) => {
        return new DoddleZodASeq({
            typeName: ZodDoddleTypeName.ASeq,
            eager: false,
            element,
            pathIdentifier: pathId ?? knownPathIds.get(element) ?? ((v, i) => `${i}`)
        })
    },
    doddle: <T>(element: ZodType<T>) => {
        return new DoddleZodDoddle({
            typeName: ZodDoddleTypeName.Doddle,
            element
        })
    }
}
