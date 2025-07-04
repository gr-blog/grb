import { discordInviteLinks, type ChannelNames } from "@/discord-invites"

export interface DiscordInviteStyle {
    text: string
    invite: ChannelNames
}

const invitesRecord: Record<ChannelNames, string[]> = {
    say_hi: ["Come and say hi over at the Discord!"],
    lounge: [
        "Join the conversation in the Discord!",
        "Relax with us in the Discord!",
        "What are you waiting for? Join the Discord!"
    ],
    code: [
        "Debugging getting you down? Check out the Discord!",
        "Come brainstorm with us in the Discord!",
        "What are you working on? Tell us in the Discord!",
        "Tabs or spaces? Say your piece in the Discord!"
    ],
    i_made_this: ["Built something great? Show it off in the Discord!"],
    forum: [
        "Questions about the post? Join the discussion in the Discord!",
        "Have something to add? Tell us in the Discord!",
        "Was this post hopelessly wrong? Let me know in the Discord!"
    ],
    hobbies: [
        "Read anything good lately? Tell us in the Discord!",
        "What are you binging? Tell us in the Discord!"
    ],
    blog_talk: [
        "How can I make the site better? Tell me in the Discord!",
        "What should I write about next? Tell me in the Discord!",
        "Have feedback? Share it in the Discord!"
    ]
}

export const discordInvites = Object.entries(invitesRecord).flatMap(([key, value]) => {
    return value.map(text => ({
        text,
        link: discordInviteLinks[key as ChannelNames]
    }))
})
