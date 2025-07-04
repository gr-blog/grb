import { yamprint as yp } from "yamprint"
import { ZodError } from "zod"
export const yamprint = yp.extend()
Error.stackTraceLimit = 20
const origError = console.error
const FakeZodError = function ZodError(this: any, err: ZodError) {
    const cleanStack = err.stack?.replace(/(.*?)( {3}at.*)/s, "$2")

    this.stack = cleanStack
    this.errors = err.errors
} as any
console.error = (...args: any[]) => {
    const [first, err] = args
    if (!(err instanceof Error)) {
        origError(...args)
        return
    }
    if (err.name === "ZodError") {
        const streamlined = new FakeZodError(err)

        origError(first, yamprint(streamlined))
    } else {
        origError(...args)
    }
}
