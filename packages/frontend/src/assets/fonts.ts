import { aseq } from "doddle"
import { readFile } from "fs/promises"
import { join } from "path"

export class AssetFont<Family extends AssetFontFamily, Weight extends AssetFontWeight> {
    private constructor(
        readonly _family: Family,
        readonly _weight: Weight,
        public readonly name: string,
        public readonly data: Buffer
    ) {}

    static async create<Family extends AssetFontFamily, Weight extends AssetFontWeight>(
        family: Family,
        weight: Weight
    ) {
        const fontLocation = join(
            process.cwd().replaceAll("\\", "/"),
            "assets",
            "fonts",
            family,
            `${family}-${weight}.ttf`
        )
        const fontData = await readFile(fontLocation)
        return new AssetFont(family, weight, `${family} ${weight}`, fontData)
    }
}

export type AssetFontWeight =
    | "Bold"
    | "Regular"
    | "Light"
    | "Medium"
    | "SemiBold"
    | "ExtraBold"
    | "Black"
export type AssetFontFamily = "FiraSans"

export const firaFonts = aseq
    .of("Bold", "Regular")
    .map(async weight => AssetFont.create("FiraSans", weight))
    .toRecord(font => [font._weight, font])
