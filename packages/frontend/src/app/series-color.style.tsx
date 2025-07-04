import { initCompiler } from "sass"

import { type BlogApi } from "@/api"
import { aseq, doddle } from "doddle"

const sassCompiler = doddle(() => {
    const sass = initCompiler()
    return sass
})

export async function getSeriesColorsCss(api: BlogApi) {
    const allSeries = aseq(api.allSeries).map(x => x[1])
    const seriesColorAssignments = await allSeries
        .map(x => `--series-color-${x.slug}: ${x.color};`)
        .join("\n")
        .pull()
    const seriesNames = await allSeries
        .map(x => x.slug)
        .toArray()
        .map(names => {
            const quoted = names.map(x => `"${x}"`)
            const spaced = quoted.join(" ")
            return spaced
        })
        .pull()
    const compiler = sassCompiler.pull()
    return compiler.compileString(
        `
        $series-names: ${seriesNames};
        :root {
            ${seriesColorAssignments}
        }
        @each $name in $series-names {
            [data-series="#{$name}"] {
                --series-color: var(--series-color-#{$name});
            }
        }   
        `
    )
}

export default async function getSeriesColorStyleTag(api: BlogApi) {
    const result = await getSeriesColorsCss(api)
    // precedence is required by React in this case but not included in the
    // type definitions
    const props = {
        precedence: "default",
        href: "series-colors"
    } as any
    return <style {...props}>{result.css}</style>
}
