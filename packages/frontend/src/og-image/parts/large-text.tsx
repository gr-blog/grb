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
                padding: 0,
                margin: 0,
                display: "flex",
                width: "60%",
                color: "grey",
                ...style
            }}
        >
            {children}
        </div>
    )
}
