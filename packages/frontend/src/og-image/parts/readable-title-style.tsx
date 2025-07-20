export function titleStyle(): React.CSSProperties {
    return {
        display: "flex",
        textShadow: "5px 5px 4px black"
    }
}
export function clearTitleStyle(color: string): React.CSSProperties {
    return {
        ...titleStyle(),
        color
    }
}

export function postTitleStyle(color: string = "white"): React.CSSProperties {
    return {
        ...clearTitleStyle(color),
        textTransform: "lowercase"
    }
}
