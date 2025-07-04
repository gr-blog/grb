import { innerUrl } from "@/app/(site)/inner-urls"
import { shareImageProperties } from "@/app/(site)/metadata-common"
import shareBackground from "@/images/og-background.jpg"

export interface ImageLayoutProps {
    children: React.ReactNode
    style?: React.CSSProperties
}
export default function ImageLayout({ children, style }: ImageLayoutProps) {
    return (
        <main
            className="image-layout"
            style={{
                fontSize: "5.5rem",
                width: shareImageProperties.width,
                height: shareImageProperties.height,
                backgroundImage: `url(${innerUrl`${shareBackground.src}`})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                ...style
            }}
        >
            {children}
        </main>
    )
}
