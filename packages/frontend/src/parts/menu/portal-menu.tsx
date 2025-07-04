import { ReactPortal, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { z } from "zod"
import "./menu.scss"
export const MenuProps = z.object({
    children: z.any(),
    className: z.string().optional(),
    selector: z.string(),
    onClose: z.function()
})
export type MenuProps = z.infer<typeof MenuProps>
export default function MenuPortal({
    children,
    className,
    selector,
    onClose
}: MenuProps): ReactPortal | null {
    const ref = useRef<HTMLDivElement | null>(null)
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        ref.current = document.querySelector(selector)
        if (!ref.current) {
            throw new Error(`MenuPortal: selector "${selector}" not found`)
        }
        setMounted(true)
    }, [selector])

    const e = (
        <>
            <i
                className="bx bx-x-circle bx-md menu__close"
                onClick={() => {
                    onClose()
                }}
            />
            <menu className={`menu-portal ${className ?? ""}`}>{children}</menu>
        </>
    )
    return !mounted ? null : createPortal(e, ref.current as Element)
}
