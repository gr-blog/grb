import type { BlogMeta } from "@/entities/blog"
import AlignmentCanvas from "./parts/alignment-canvas"
import BackgroundLogo from "./parts/background-logo"
import LargeText from "./parts/large-text"
import { clearTitleStyle } from "./parts/readable-title-style"
import ImageLayout from "./roots/image-layout"

export function homeImage(metadata: BlogMeta) {
    const topicsDivs = metadata.topics.map(topic => <div key={topic}>{topic}</div>)
    return (
        <ImageLayout>
            <BackgroundLogo />
            <AlignmentCanvas style={{}}>
                <LargeText
                    style={{
                        ...clearTitleStyle("white"),
                        width: "100%",
                        fontSize: "2em",
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div>{metadata.title}</div>
                </LargeText>
            </AlignmentCanvas>
        </ImageLayout>
    )
}
