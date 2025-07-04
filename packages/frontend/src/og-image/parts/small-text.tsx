export interface SmallTextProps {
    children: React.ReactNode
    style?: React.CSSProperties
}

export default function SmallText({ children, style }: SmallTextProps) {
    return (
        <div
            style={{
                justifySelf: "flex-start",
                textAlign: "left",
                fontSize: "0.5em",
                fontFamily: "FiraSans Regular",
                color: "grey",
                display: "flex",
                flexDirection: "row",
                paddingLeft: "10px",
                ...style
            }}
        >
            {children}
        </div>
    )
}
