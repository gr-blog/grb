import type { RESTManager } from "oceanic.js"
import { rootLogger } from "../logging/index.js"

const discordLogger = rootLogger.child({ part: "discord" })
export function createOceanicRestMock(): RESTManager {
    const currentUser = {
        id: "123456789012345678",
        username: "TestUser",
        discriminator: "0001",
        avatar: null,
        bot: false,
        system: false,
        mfaEnabled: false,
        locale: "en-US",
        verified: true,
        email: "testuser@example.com"
    }
    return {
        hostname: "gregros.dev",
        currentUser,
        oauth: {
            getCurrentUser: async () => currentUser
        },
        channels: {
            createMessage: async (channelId: string, content: any) => {
                discordLogger.info("Mock createMessage called", {
                    channelId,
                    content
                })
            },
            getMessages: async (channelId: string, options?: any) => {
                discordLogger.info("Mock getMessages called", {
                    channelId,
                    options
                })
                return []
            }
        }
    } as any
}
