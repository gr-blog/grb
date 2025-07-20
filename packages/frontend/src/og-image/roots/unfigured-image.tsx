import AlignmentCanvas from "../parts/alignment-canvas"
import BackgroundLogo from "../parts/background-logo"
import LargeText from "../parts/large-text"
import { postTitleStyle } from "../parts/readable-title-style"
import SmallText from "../parts/small-text"
import ImageLayout from "./image-layout"

export interface UnfiguredImageProps {
    title: string
    series: string
    seriesColor: string
    site: string
}

export function UnfiguredImage({ title, series, site, seriesColor }: UnfiguredImageProps) {
    return (
        <ImageLayout>
            <BackgroundLogo />
            <AlignmentCanvas>
                <LargeText style={postTitleStyle()}>{title}</LargeText>
                <SmallText>
                    <div>a post in the</div>
                    <div
                        style={{
                            color: seriesColor,
                            paddingLeft: "0.3em",
                            paddingRight: "0.3em",
                            fontFamily: "FiraSans Bold"
                        }}
                    >
                        {series}
                    </div>
                    <div>series</div>
                </SmallText>
            </AlignmentCanvas>
        </ImageLayout>
    )
}
