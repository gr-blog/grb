import { Injectable, NestMiddleware } from "@nestjs/common"
import type { NextFunction, Request, Response } from "express"
import { truncate } from "lodash-es"
import { MyLoggerService } from "../app/svc/logger.s.js"

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
    constructor(private readonly log: MyLoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req
        const start = Date.now()

        res.on("finish", () => {
            const isOk = res.statusCode >= 200 && res.statusCode < 300
            this.log.verbose(
                `${isOk ? "✅" : "❌"} Δ${Date.now() - start}ms ${method} ${truncate(originalUrl, {
                    length: 100,
                    omission: "⋯"
                })} → ${res.statusCode} ${res.get("content-length") ?? 0}`,
                {
                    part: "WebAccess"
                }
            )
        })

        next()
    }
}
