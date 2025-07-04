import type { BlogMeta } from "@/entities/blog"
import AlignmentCanvas from "./parts/alignment-canvas"
import BackgroundLogo from "./parts/background-logo"
import ImageLayout from "./parts/image-layout"
import LargeText from "./parts/large-text"
import { clearTitleStyle } from "./parts/readable-title-style"
import Signature from "./parts/signature"
import SmallText from "./parts/small-text"

export function seriesImage(
    series: { color: string; title: string; tagline: string },
    meta: BlogMeta
) {
    return (
        <ImageLayout>
            <BackgroundLogo />
            <AlignmentCanvas>
                <LargeText style={clearTitleStyle("white")}>
                    <div
                        style={{
                            color: series.color,
                            paddingRight: "0.3em"
                        }}
                    >
                        {series.title}
                    </div>
                    <div>series</div>
                </LargeText>
                <SmallText
                    style={{
                        textTransform: "lowercase"
                    }}
                >
                    {series!.tagline}
                </SmallText>
            </AlignmentCanvas>
            <Signature text={meta.title} />
        </ImageLayout>
    )
}
