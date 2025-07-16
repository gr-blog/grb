import { discordInviteLinks } from "@/discord-invites"
import { Container, Heading, Text } from "@react-email/components"
import type { CSSProperties } from "react"

export default function ThankYouBody() {
    const textCss: CSSProperties = {
        fontSize: 20,
        lineHeight: "1.5",
        marginBottom: "20px"
    }
    const lowerTextCss: CSSProperties = {
        ...textCss,
        fontSize: 16,
        textAlign: "center"
    }
    return (
        <Container>
            <Heading style={{ fontSize: 35, textAlign: "center" }} as="h1">
                Thank you for subscribing!
            </Heading>
            <Text style={textCss}>
                After years of directing a startup's tech roadmap, I started my blog to show that
                even the most complex subjects in our field, from distributed systems to JavaScript
                engines, can be explained in plain language.
            </Text>
            <Text style={textCss}>
                I'm glad you'll join me as I turn the insights I've gathered into articles that will
                be free for everyone and forever.
            </Text>
            <Text style={textCss}>
                Look forward to posts tackling a wide range of advanced topics, from TypeScript and
                the web platform to distributed systems and API design.
            </Text>
            <Text style={lowerTextCss}>
                Feel free to drop by <a href={discordInviteLinks.lounge}>the Discord</a> if you're
                curious about what I'm working on next.
            </Text>
        </Container>
    )
}
