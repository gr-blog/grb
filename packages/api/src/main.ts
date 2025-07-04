export interface NextJsOptions {
    port: number
    contentDir: string
}
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app/mod/app.m.js"
import { MyLoggerService } from "./app/svc/logger.s.js"

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new MyLoggerService(),
        abortOnError: false,
        bufferLogs: false
    })
    await app.listen(3000)
}
await bootstrap()
