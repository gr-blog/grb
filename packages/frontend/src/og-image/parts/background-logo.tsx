import { innerUrl } from "@/app/(site)/inner-urls"
import logo from "@/images/polyflower-3-3.png"

export default function TransparentLogo(style: React.CSSProperties) {
    return (
        <img
            id="logo"
            src={innerUrl`${logo.src}`}
            alt="logo"
            height="500"
            width="500"
            style={{
                ...style,
                alignSelf: "flex-end",
                marginRight: "3rem",
                marginBottom: "3rem",
                justifySelf: "flex-end",
                opacity: 0.55
            }}
        />
    )
}
