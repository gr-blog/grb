export default {
    linkedIn: "https://www.linkedin.com/in/greg-ros/",
    github: "https://github.com/GregRos",
    email: "gregros@gregros.dev",
    discordInviteDev: "https://discord.gg/ePjFUSRfPh",
    discordInviteXyz: "https://discord.gg/jRaZMHKwVz",
    bluesky: "https://bsky.app/profile/gregros.dev",
    ownUrl(hostname: string) {
        return `https://${hostname}`
    },
    ownRssFeed(hostname: string) {
        return `https://${hostname}/api/rss`
    }
}
