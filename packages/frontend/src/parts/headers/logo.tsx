import logoHand from "@/images/polyflower-3-3.png"
import { zr } from "@/zod/react"
import Image from "next/image"
import { z } from "zod"

export const LogoProps = z.object({
    className: z.string().optional()
})

export type LogoProps = z.infer<typeof LogoProps>
export default zr.checked(LogoProps, function Logo({ className }: LogoProps) {
    return (
        <Image
            priority={true}
            src={logoHand}
            width={500}
            height={500}
            alt={"Logo showing strokes of color exlpoding outwards from an orange orb"}
            className={`logo ${className ?? ""}`}
        />
    )
})
