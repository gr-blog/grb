import { noCharOf, rest, whitespace } from "parjs"
import { many, map, qthen, recover, then, thenq } from "parjs/combinators"

const descriptionBlock = whitespace().pipe(
    thenq("%%%?"),
    qthen(
        noCharOf("%").pipe(
            many(),
            thenq("%%"),
            map(x => x.join(""))
        )
    ),
    recover(x => ({
        kind: "Soft"
    }))
)
const beforeRule = descriptionBlock.pipe(
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
