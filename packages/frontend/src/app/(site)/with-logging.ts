import { useRouter } from "next/router"
import { routerLogger } from "./logger"

export function withLogging<F extends (...args: any[]) => any>(fn: F): F {
    const router = useRouter()
    routerLogger.info(router.basePath)
    return ((...args: any[]) => {
        const result = fn(...args)
        console.log(`Function returned: ${result}`)
        return result
    }) as unknown as F
}
