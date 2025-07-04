import chalk from "chalk"
import dayjs from "dayjs"
import { yamprint } from "yamprint"
chalk.level = 2

function getLevelEmoji(level: number) {
    switch (level) {
        case 10:
            return "😴"
        case 20:
            return "💭"
        case 30:
            return "💬"
        case 40:
            return "⚠️ "
        case 50:
            return "⛔"
        case 60:
            return "💀"
        default:
            return "❓"
    }
}
export function levelChalkFormatter(level: number) {
    switch (level) {
        case 10:
            return chalk.gray
        case 20:
            return chalk.cyanBright
        case 30:
            return chalk.whiteBright
        case 40:
            return chalk.yellowBright
        case 50:
            return chalk.redBright
        case 60:
            return chalk.bgRedBright.black
        default:
            return chalk.white
    }
}

function formatContext(ctx: any) {
    const yamprinted = yamprint(ctx)
    if (yamprinted === "" || yamprinted === "{}") {
        return ""
    }
    return yamprinted
        .split("\n")
        .map(x => `  ${x}`)
        .join("\n")
}
Error.stackTraceLimit = 1000
export function expandContextTokens(message: string, context: Record<string, any>) {
    // expand {token} in message with context[token]
    const foundTokens = new Set<string>()
    const result = message.replace(/{([^}]+)}/g, (match, token) => {
        if (context[token]) {
            foundTokens.add(token)
        }
        return context[token] || match
    })
    for (const token of foundTokens) {
        delete context[token]
    }
    return result
}
export function formatMessage(message: string) {
    const obj = JSON.parse(message)
    const time = new Date(obj.time)
    const dt = dayjs(time).format("HH:mm:ss{D}").replace("{", "[").replace("}", "]")
    const logLevel = obj.context.logLevel
    delete obj.context.logLevel
    const levelEmoji = getLevelEmoji(logLevel)
    const properties = yamprint(obj.context)
    obj.message = expandContextTokens(obj.message, obj.context)
    const myChalk = levelChalkFormatter(logLevel)
    const firstLine = chalk.bold(myChalk(`${dt} ${levelEmoji} ${obj.message}`))
    const stuffs = [firstLine]
    const rest = formatContext(obj.context)
    if (rest) {
        stuffs.push(rest)
    }
    return stuffs.join("\n")
}
