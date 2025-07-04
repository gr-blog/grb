import { Fira_Code, Fira_Sans } from "next/font/google"

export const firaSans = Fira_Sans({
    display: "swap",
    subsets: ["latin"],
    style: ["normal", "italic"],
    weight: ["400", "500", "700", "900"]
})

export const firaCode = Fira_Code({
    display: "swap",
    variable: "--fira-code",
    subsets: ["latin"],
    weight: "variable"
})
