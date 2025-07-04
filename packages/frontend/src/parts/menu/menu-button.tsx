"use client"

import { zr } from "@/zod/react"
import { useState } from "react"
import { z } from "zod"
import MenuPortal from "./portal-menu"

export const MenuButtonProps = z.object({
    selector: z.string(),
    menuClassName: z.string(),
    children: z.any(),
    buttonClassName: z.string().optional()
})

export type MenuButtonProps = z.infer<typeof MenuButtonProps>
export default zr.checked(
    MenuButtonProps,
    function MenuButton({ selector, menuClassName, children, buttonClassName }: MenuButtonProps) {
        const [menuOpen, setMenuOpen] = useState(false)
        const menu = menuOpen && (
            <MenuPortal
                selector={selector}
                className={menuClassName}
                onClose={() => {
                    setMenuOpen(false)
                }}
            >
                <h2 className="menu__heading">Series</h2>

                {children}
            </MenuPortal>
        )
        return (
            <>
                <a
                    className={`menu-button ${menuOpen ? "menu-button--open" : ""} ${buttonClassName ?? ""}`}
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                    }}
                >
                    {!menuOpen ? <i className="bx bx-menu" /> : <i className="bx bx-x-circle"></i>}
                </a>
                {menu}
            </>
        )
    }
)
