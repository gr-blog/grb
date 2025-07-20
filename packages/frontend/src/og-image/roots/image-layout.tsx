import { shareImageProperties } from "@/app/(site)/metadata-common"

export interface ImageLayoutProps {
    children: React.ReactNode
    style?: React.CSSProperties
}
export default function ImageLayout({ children, style }: ImageLayoutProps) {
    return (
        <main
            className="image-layout"
            style={{
                fontSize: "3.5rem",
                width: shareImageProperties.width,
                height: shareImageProperties.height,
                backgroundColor: "#1c1a28",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                ...style
            }}
        >
            {children}
        </main>
    )
}
