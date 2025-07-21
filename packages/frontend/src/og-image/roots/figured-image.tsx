import AlignmentCanvas from "../parts/alignment-canvas"
import TransparentLogo from "../parts/background-logo"
import Signature from "../parts/signature"
import ImageLayout from "./image-layout"
export interface FiguredImageProps {
    title: string
    figureUrl: string
    site: string
}
export function FiguredImage({ title, figureUrl, site }: FiguredImageProps) {
    return (
        <ImageLayout>
            <img
                src={figureUrl}
                alt={title}
                width={500}
                height={500}
                style={{
                    width: "70%",
                    alignSelf: "center",
                    justifySelf: "center"
                }}
            />
            <AlignmentCanvas>
                <TransparentLogo
                    opacity={0.4}
                    position="absolute"
                    width="200px"
                    height="200px"
                    bottom="10px"
                    right="10px"
                />
                <Signature text={site} />
            </AlignmentCanvas>
        </ImageLayout>
    )
}
