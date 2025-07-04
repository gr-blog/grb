import { SafeParseReturnType, ZodType, ZodTypeDef, type ParseParams } from "zod"
import "../yamprint"

declare module "zod" {
    export interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
        is(value: unknown): value is Input

        check(value: Input, params?: Partial<ParseParams>): Output
        checkAsync(value: Input, params?: Partial<ParseParams>): Promise<Output>
        safeCheck(value: Input, params?: Partial<ParseParams>): SafeParseReturnType<Input, Output>
        safeCheckAsync(
            value: Input,
            params?: Partial<ParseParams>
        ): Promise<SafeParseReturnType<Input, Output>>
    }
}

ZodType.prototype.check = function (value, params) {
    return this.parse(value, params)
}
ZodType.prototype.checkAsync = async function (value, params) {
    return this.parseAsync(value, params)
}
ZodType.prototype.safeCheck = function (value, params) {
    return this.safeParse(value, params)
}
ZodType.prototype.safeCheckAsync = async function (value, params) {
    return this.safeParseAsync(value, params)
}

ZodType.prototype.is = function (value): value is any {
    return this.safeCheck(value).success as any
}
