import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MyLoggerService } from "../logger.s.js"
import { DiscordClientProvider } from "./discord-client.svc.js"
import { DISCORD_CLIENT } from "./import-token.js"
import { SendAdvertService } from "./sender.svc.js"

@Module({
    imports: [ConfigModule],
    providers: [DiscordClientProvider, SendAdvertService, MyLoggerService],
    exports: [DISCORD_CLIENT, SendAdvertService]
})
export class DiscordClientModule {}
