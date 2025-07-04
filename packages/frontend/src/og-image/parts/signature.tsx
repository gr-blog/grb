export default function Signature({ text }: { text: string }) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "0",
                fontSize: "3rem",
                right: "0",
                padding: "1rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                color: "#000",
                opacity: 0.8,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}
        >
            {text}
        </div>
    )
}
