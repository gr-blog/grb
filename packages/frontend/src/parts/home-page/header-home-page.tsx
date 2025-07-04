import HomeLink from "@/parts/crumbs/home-link"
import PageHeader from "@/parts/headers/page-header"
import { zr } from "@/zod/react"
import { z } from "zod"

export const HeaderHomePageProps = z.object({
    menuButton: z.any()
})

export type HeaderHomePageProps = z.infer<typeof HeaderHomePageProps>

export default zr.checked(
    HeaderHomePageProps,
    async function HeaderHomePage({ menuButton }: HeaderHomePageProps) {
        const header = (cls?: string) => (
            <PageHeader className={cls}>
                <div className="header-home">
                    <div className="header-home__primary">
                        <HomeLink>
                            <h1 className="header-home__heading">GregRos</h1>
                        </HomeLink>
                        <aside className="header-home__aside"></aside>
                    </div>
                    <div className="header-home__menu">{menuButton}</div>
                </div>
            </PageHeader>
        )
        return (
            <>
                {header()}
                {header("sticky-top-nav")}
            </>
        )
    }
)
