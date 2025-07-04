import { PostListingDtoWithSeries, PostPreviewDtoWithSeries } from "@/entities/dto/post"
import { Series } from "@/entities/series"
import HeaderHomePage from "@/parts/home-page/header-home-page"
import ListBody from "@/parts/list-body/list-body"
import { zd } from "@/zod/doddle"
import { zr } from "@/zod/react"
import { z } from "zod"
import MenuButton from "../menu/menu-button"
import SeriesGrid from "../series-grid/series-grid"
import "./home-page.scss"

export const HomePageProps = z.object({
    latest: zd.seq(PostPreviewDtoWithSeries),
    otherStuff: zd.seq(PostListingDtoWithSeries),
    series: zd.seq(Series)
})
export type HomePageProps = z.infer<typeof HomePageProps>
export default zr.checked(
    HomePageProps,
    function HomeBody({ latest, otherStuff, series }: HomePageProps) {
        return (
            <ListBody
                pageName="home"
                header={
                    <HeaderHomePage
                        menuButton={
                            <MenuButton
                                selector="#menu"
                                menuClassName="menu"
                                buttonClassName="title-crumbs__menu"
                            >
                                <SeriesGrid series={series} />
                            </MenuButton>
                        }
                    />
                }
                latest={latest}
                series={series}
                otherStuff={otherStuff}
            />
        )
    }
)
