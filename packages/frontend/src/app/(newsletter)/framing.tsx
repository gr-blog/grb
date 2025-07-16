import type { BlogApi } from "@/api"
import {
    Body,
    Column,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Row,
    Section,
    Text
} from "@react-email/components"

export interface FramingOptions {
    children: React.ReactNode
    api: BlogApi
}

export function Framing({ children, api }: FramingOptions) {
    return (
        <Html
            lang="en"
            style={{
                background: "#FFFFFF"
            }}
        >
            <Head></Head>
            <Body style={{ margin: 0, padding: 0 }}>
                <Container>
                    <Section>{children}</Section>
                    <Hr />
                    <Section>
                        <Row>
                            <Column style={{ fontSize: "24px" }}>
                                <Img
                                    src={`${api.realOrigin}/signature.png`}
                                    width={128}
                                    style={{
                                        width: "7.5rem",
                                        height: "auto"
                                    }}
                                />
                            </Column>
                            <Column width={"35%"} style={{ fontSize: "14px" }}>
                                <Text style={{ margin: 0, padding: 0, marginBottom: 4 }}>
                                    You received this email because you signed up to the gregros.dev
                                    newsletter.
                                </Text>
                                <Container style={{ textAlign: "center" }}>
                                    <Link href="#unsubscribeLink#" style={{ textAlign: "center" }}>
                                        Unsubscribe
                                    </Link>
                                </Container>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}
