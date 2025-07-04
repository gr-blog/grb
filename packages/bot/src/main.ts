import { NestFactory } from "@nestjs/core"
import { setTimeout } from "timers/promises"
import { AppModule } from "./app/app.m.js"
import { AnnounceController } from "./app/ctrl/index.js"
import { MyLoggerService } from "./app/logger.s.js"

const mainLogger = new MyLoggerService().child({
    part: "main"
})
async function main() {
    mainLogger.log("Starting discord blog announcer...")
    const app = await NestFactory.create(AppModule, {
        logger: new MyLoggerService(),
        abortOnError: false,
        bufferLogs: false
    })
    await app.listen(3002)

    await setTimeout(5000)
    const advertDb = app.get(AnnounceController)
    await advertDb.announce("manual")
}
main().catch(err => {
    mainLogger.error("Failed to start discord blog announcer", {
        error: err.message,
        stack: err.stack
    })
    process.exit(1)
})
