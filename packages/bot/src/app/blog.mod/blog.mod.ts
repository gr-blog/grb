import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import EnvConfig from "../../env.js"
import { DiscordClientModule } from "../client.mod/discord-client.mod.js"
import { MyLoggerService } from "../logger.s.js"
import { AdvertDbService, BLOG_INFO, type BlogInfo } from "./advert-db.js"
import { ANNOUNCE_CUTOFF, AnnouncerService } from "./announcer.svc.js"

@Module({})
export class BlogModule {
    static register(blogInfo: BlogInfo) {
        return {
            module: BlogModule,
            imports: [DiscordClientModule, ConfigModule],
            providers: [
                MyLoggerService,
                {
                    provide: BLOG_INFO,
                    useValue: blogInfo
                },
                AdvertDbService,
                {
                    provide: blogInfo.announcerSymbol,
                    useClass: AnnouncerService
                },
                {
                    provide: ANNOUNCE_CUTOFF,
                    useFactory(cfg: ConfigService<EnvConfig>) {
                        return cfg.getOrThrow("ANNOUNCE_CUTOFF")
                    },
                    inject: [ConfigService]
                }
            ],
            exports: [blogInfo.announcerSymbol]
        }
    }
}
