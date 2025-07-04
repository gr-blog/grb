import { type Provider } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Client, RESTManager, type ExtendedUser } from "oceanic.js"
import { createOceanicRestMock } from "../../client-mock/oceanic-rest-mock.js"
import type EnvConfig from "../../env.js"
import { MyLoggerService } from "../logger.s.js"
import { DISCORD_CLIENT } from "./import-token.js"

export class DiscordClientService extends RESTManager {
    constructor(
        rm: RESTManager,
        readonly currentUser: ExtendedUser,
        private readonly _logger: MyLoggerService
    ) {
        super(rm.client, rm.options)
        this._logger = this._logger.child({
            part: "discord-client",
            userId: currentUser.id,
            userName: currentUser.username
        })
    }

    static async create(token: string, logger: MyLoggerService): Promise<DiscordClientService> {
        const client = new Client({ auth: `Bot ${token}` })
        // Fire a minimal test request to verify the token works.
        try {
            const rest = client.rest
            const user = await rest.oauth.getCurrentUser()
            logger.log("Discord REST client authenticated successfully")
            client.on("error", err => {
                logger.error("Discord client error", { err })
            })
            return new DiscordClientService(rest, user, logger)
        } catch (err) {
            logger.error("Failed to authenticate Discord REST client", { err })
            throw err
        }
    }
}
export const DiscordClientProvider: Provider = {
    provide: DISCORD_CLIENT,
    useFactory(
        cfg: ConfigService<EnvConfig>,
        logger: MyLoggerService
    ): Promise<DiscordClientService> {
        if (cfg.getOrThrow("MOCK_DISCORD")) {
            logger.warn("Using mock Discord client")
            return Promise.resolve(createOceanicRestMock() as DiscordClientService)
        } else {
            logger.log("Creating real Discord client")
            return DiscordClientService.create(cfg.getOrThrow("TOKEN_DISCORD"), logger)
        }
    },
    inject: [ConfigService, MyLoggerService]
}
