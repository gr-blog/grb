export interface AlignmentCanvasProps {
    children: React.ReactNode
    style?: React.CSSProperties
}
export default function CaptionCanvas({ children, style }: AlignmentCanvasProps) {
    return (
        <main
            className="alignment-canvas"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                paddingLeft: "30px",
                paddingTop: "1rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                ...style
            }}
        >
            {children}
        </main>
    )
}
