import chalk from "chalk"
import dayjs from "dayjs"
import { yamprint } from "../yamprint.js"
function getLevelEmoji(level: number) {
    switch (level) {
        case 10:
            return "🐜"
        case 20:
            return "🔍"
        case 30:
            return "😐"
        case 40:
            return "⚠️ "
        case 50:
            return "💔"
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

function normLogLevel(level: string) {
    switch (level.toLowerCase()) {
        case "trace":
            return 10
        case "debug":
            return 20
        case "info":
            return 30
        case "warn":
        case "warning":
            return 40
        case "error":
            return 50
        case "fatal":
            return 60
        default:
            return 30
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

export interface LogInfo {
    timestamp?: number
    message?: string
    part?: string
    level?: string
}

export function print(obj: LogInfo) {
    const time = new Date(obj.timestamp!)
    const dt = dayjs(time).format("HH:mm:ss{D}").replace("{", "[").replace("}", "]")
    const logLevel = normLogLevel(obj.level!)
    delete obj.level
    const part = obj.part || "??"
    delete obj.part
    delete obj.timestamp
    const levelEmoji = getLevelEmoji(logLevel)

    const myChalk = levelChalkFormatter(logLevel)
    const firstLine = myChalk.bold(myChalk(`${dt} ${levelEmoji} [${part}] ${obj.message}`))
    delete obj.message

    const stuffs = [firstLine]
    const rest = formatContext(obj)
    if (rest) {
        stuffs.push(rest)
    }
    return stuffs.join("\n") + "\n"
}
