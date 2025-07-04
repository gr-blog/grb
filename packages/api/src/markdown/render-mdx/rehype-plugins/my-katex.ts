import rehypeKatex from "rehype-katex"
import { PluginList } from "../plugin.js"
export default PluginList.create([
    rehypeKatex,
    {
        globalGroup: true,
        macros: {
            "\\texttrademark": "™"
        },
        output: "mathml"
    }
])
