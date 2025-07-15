/* prettier-ignore */
import * as winston from "winston"
import { print } from "./printer.js"

const myPrint = winston.format.printf(info => print(info as any))
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "silly",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "blog.log"
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        myPrint
    )
})

export { logger }
