import { zr } from "@/zod/react"
import Image from "next/image"
import z from "zod"
import "./discord-invite.scss"
import { discordInvites } from "./invite-styles"
export const DiscordInviteItemProps = z.object({
    className: z.string().optional(),
    style: z.record(z.string()).optional()
})

function getRandomLine() {
    const randomIndex = Math.floor(Math.random() * discordInvites.length)
    return discordInvites[randomIndex]
}

export type DiscordInviteItemProps = z.infer<typeof DiscordInviteItemProps>
export default zr.checked(
    DiscordInviteItemProps,
    function DiscordBanner({ className, style }: DiscordInviteItemProps) {
        const { text, link } = getRandomLine()
        return (
            <li key="discord-invite" className={`discord-invite ${className ?? ""}`} style={style}>
                <a className="discord-invite__inner" href={link}>
                    <Image
                        width={32}
                        height={32}
                        src="/discord.png"
                        alt="Discord Logo"
                        className="discord-invite__logo"
                    />
                    <div className="discord-invite__text">{text}</div>
                </a>
            </li>
        )
    }
)
