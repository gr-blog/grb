import { doddle } from "doddle"
import highlight from "../../syntax-highlighting/index.js"
import { PluginList } from "../plugin.js"
import { externalLinks } from "./external-links.js"
import { mathAnnotations } from "./math-annotations.js"
import sectionArticle from "./section-article.js"
import { slugifyAndLink } from "./slugify-headings.js"
export default doddle(async () => {
    const highlighting = await highlight.pull()
    return PluginList.create(
        [mathAnnotations],
        [slugifyAndLink],
        [highlighting],
        [sectionArticle],
        externalLinks
    )
})
