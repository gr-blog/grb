import type { BlogMeta } from "@/entities/blog"
import type { PostPreviewDtoWithSeries } from "@/entities/dto/post"
import AlignmentCanvas from "./parts/alignment-canvas"
import BackgroundLogo from "./parts/background-logo"
import ImageLayout from "./parts/image-layout"
import LargeText from "./parts/large-text"
import { postTitleStyle } from "./parts/readable-title-style"
import Signature from "./parts/signature"
import SmallText from "./parts/small-text"

export function postImage(post: PostPreviewDtoWithSeries, meta: BlogMeta) {
    const series = post.series
    return (
        <ImageLayout>
            <BackgroundLogo />
            <AlignmentCanvas>
                <LargeText style={postTitleStyle()}>{post.title}</LargeText>
                <SmallText>
                    {" "}
                    <div>a post in the</div>
                    <div
                        style={{
                            color: series.color,
                            paddingLeft: "0.3em",
                            paddingRight: "0.3em",
                            fontFamily: "FiraSans Bold"
                        }}
                    >
                        {series.title}
                    </div>
                    <div>series</div>
                </SmallText>
            </AlignmentCanvas>

            <Signature text={meta.title} />
        </ImageLayout>
    )
}
