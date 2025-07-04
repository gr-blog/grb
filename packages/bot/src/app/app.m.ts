import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import EnvConfig from "../env.js"
import { BLOG_DEV, BLOG_XYZ } from "./blog-symbols.js"
import { BlogModule } from "./blog.mod/blog.mod.js"
import { DiscordClientModule } from "./client.mod/discord-client.mod.js"
import { AnnounceController } from "./ctrl/index.js"
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env", ".env.local"],
            cache: true,
            validate: x => {
                return EnvConfig.parse(x)
            }
        }),
        DiscordClientModule,
        BlogModule.register({
            host: "gregros.dev",
            announcerSymbol: BLOG_DEV,
            dataChannelName: "CHANNEL_ID_DEV_DATA"
        }),
        BlogModule.register({
            host: "gregros.xyz",
            announcerSymbol: BLOG_XYZ,
            dataChannelName: "CHANNEL_ID_XYZ_DATA"
        })
    ],
    controllers: [AnnounceController]
})
export class AppModule {}
