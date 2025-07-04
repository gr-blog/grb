export default function LargeText({
    children,
    style
}: {
    children: React.ReactNode
    style?: React.CSSProperties
}) {
    return (
        <div
            style={{
                alignSelf: "flex-start",
                justifySelf: "flex-start",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "row",
                color: "grey",
                marginTop: "13%",
                ...style
            }}
        >
            {children}
        </div>
    )
}
