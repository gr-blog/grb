import type { BlogMeta } from "@/entities/blog"
import AlignmentCanvas from "./parts/alignment-canvas"
import BackgroundLogo from "./parts/background-logo"
import LargeText from "./parts/large-text"
import { clearTitleStyle } from "./parts/readable-title-style"
import Signature from "./parts/signature"
import SmallText from "./parts/small-text"
import ImageLayout from "./roots/image-layout"

export function seriesImage(
    series: { color: string; title: string; tagline: string },
    meta: BlogMeta
) {
    return (
        <ImageLayout>
            <BackgroundLogo />
            <AlignmentCanvas>
                <Signature text={meta.title} />
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
                        textTransform: "lowercase",
                        color: "#CECECEFF"
                    }}
                >
                    {series!.tagline}
                </SmallText>
            </AlignmentCanvas>
        </ImageLayout>
    )
}
