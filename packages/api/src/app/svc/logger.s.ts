import { Injectable, type LoggerService } from "@nestjs/common"
import { logger } from "../../logging/index.js"

@Injectable()
export class MyLoggerService implements LoggerService {
    private _winston: any = logger
    constructor() {}

    child(fields: Record<string, any>) {
        const c = this._winston.child(fields)
        const childLogger = new MyLoggerService()
        childLogger._winston = c
        return childLogger
    }

    private _toCallArgs(message: any, ...optionalParams: any[]): any[] {
        let [first, second, ...rest] = optionalParams
        if (typeof first === "string") {
            first = {
                part: first
            }
        }
        return [message, first, second, ...rest]
    }
    /** Write a 'log' level log. */
    log(...args: [any, object?, ...any[]]) {
        this._winston.info(...this._toCallArgs(...args))
    }

    /** Write a 'fatal' level log. */
    fatal(...args: [any, object?, ...any[]]) {
        this._winston.fatal(...this._toCallArgs(...args))
    }

    /** Write an 'error' level log. */
    error(...args: [any, object?, ...any[]]) {
        this._winston.error(...this._toCallArgs(...args))
    }

    /** Write a 'warn' level log. */
    warn(...args: [any, object?, ...any[]]) {
        this._winston.warn(...this._toCallArgs(...args))
    }

    /** Write a 'debug' level log. */
    debug(...args: [any, object?, ...any[]]) {
        this._winston.debug(...this._toCallArgs(...args))
    }

    /** Write a 'verbose' level log. */
    verbose(...args: [any, object?, ...any[]]) {
        this._winston.silly(...this._toCallArgs(...args))
    }
}
