export default function Signature({ text }: { text: string }) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "20px",
                width: "193px",
                fontSize: "2rem",
                right: "0",
                color: "#B3B2B2FF"
            }}
        >
            {text}
        </div>
    )
}
