import { anyChar, newline, rest } from "parjs"
import { manyTill, map, recover, then } from "parjs/combinators"

const rule = newline().pipe(
    then("---", newline()),
    recover(x => ({
        kind: "Soft"
    }))
)
const beforeRule = anyChar().pipe(
    manyTill(rule, beforeChars => {
        return beforeChars.join("")
    }),
    then(rest()),
    map(x => {
        return {
            before: x[0],
            after: x[1]
        }
    })
)
export function cutAtFirstRule(text: string) {
    const result = beforeRule.parse(text)
    if (result.isOk) {
        return result.value
    }
    return text
}
