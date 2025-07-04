import { Series } from "@/entities/series"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import Crumbs from "../crumbs/crumbs"
import PageHeader from "../headers/page-header"
import MenuButton from "../menu/menu-button"
import SeriesGrid from "../series-grid/series-grid"
import "./title-breadcrumbs.scss"

export const TitleCrumbsHeaderProps = z.object({
    children: z.any(),
    heading: z.string(),
    allSeries: zd.seq(Series)
})

export type TitleCrumbsHeaderProps = z.infer<typeof TitleCrumbsHeaderProps>

export default zr.checked(
    TitleCrumbsHeaderProps,
    async function TitleCrumbsHeader({ children, heading, allSeries }: TitleCrumbsHeaderProps) {
        const header = (cls?: string) => (
            <PageHeader className={`${cls} title-crumbs-header`}>
                <div className="title-crumbs">
                    <Crumbs className="title-crumbs__crumbs" itemClassName="header-post__crumb">
                        {children}
                    </Crumbs>
                    <h1 className="title-crumbs__heading">{heading}</h1>
                    <MenuButton
                        selector="#menu"
                        menuClassName="menu"
                        buttonClassName="title-crumbs__menu"
                    >
                        <SeriesGrid series={allSeries} />
                    </MenuButton>
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
