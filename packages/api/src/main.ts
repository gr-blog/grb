export interface NextJsOptions {
    port: number
    contentDir: string
}
import { NestFactory } from "@nestjs/core"
import { setTimeout } from "timers/promises"
import { AppModule } from "./app/mod/app.m.js"
import { MyLoggerService } from "./app/svc/logger.s.js"
import { Prewarmer } from "./prewarm.js"

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new MyLoggerService(),
        abortOnError: false,
        bufferLogs: false
    })
    await app.listen(3000)

    await setTimeout(10 * 1000)
    const logger = app.get(MyLoggerService)
    const prewarmer = new Prewarmer(logger)
    await prewarmer.prewarmCycle().catch(err => {
        logger
            .child({
                part: "prewarmer"
            })
            .error("Prewarming failed", err)
    })
}
await bootstrap()
