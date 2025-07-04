import type { BlogMeta } from "@/entities/blog"
import AlignmentCanvas from "./parts/alignment-canvas"
import BackgroundLogo from "./parts/background-logo"
import ImageLayout from "./parts/image-layout"
import LargeText from "./parts/large-text"
import { clearTitleStyle } from "./parts/readable-title-style"
import SmallText from "./parts/small-text"

export function homeImage(metadata: BlogMeta) {
    const topicsDivs = metadata.topics.map(topic => <div key={topic}>{topic}</div>)
    return (
        <ImageLayout>
            <BackgroundLogo />
            <AlignmentCanvas>
                <LargeText style={clearTitleStyle("white")}>
                    <div>{metadata.title}</div>
                </LargeText>
                <SmallText
                    style={{
                        textTransform: "lowercase",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        {topicsDivs}
                    </div>
                </SmallText>
            </AlignmentCanvas>
        </ImageLayout>
    )
}
