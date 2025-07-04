import { shareImageProperties } from "@/app/(site)/metadata-common"
import { firaFonts } from "@/assets/fonts"
import { ImageResponse } from "next/og"

export async function imageResponse(element: React.ReactElement) {
    const fira = await firaFonts.pull()
    return new ImageResponse(element, {
        height: shareImageProperties.height,
        width: shareImageProperties.width,
        fonts: [fira.Bold, fira.Regular]
    })
}
