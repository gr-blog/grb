/* prettier-ignore */
import * as winston from "winston"
import { print } from "./printer.js"

const myPrint = winston.format.printf(info => print(info as any))
const rootLogger = winston.createLogger({
    level: "silly",
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

export { rootLogger }
