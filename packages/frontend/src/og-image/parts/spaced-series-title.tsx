export default function SpacedSeriesTitle({ series, color }: { series: string; color: string }) {
    return (
        <div
            style={{
                color: color,
                paddingLeft: "0.3em",
                paddingRight: "0.3em"
            }}
        >
            {series}
        </div>
    )
}
