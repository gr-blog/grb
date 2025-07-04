import behead from "remark-behead"
import { PluginList } from "../plugin.js"

export default PluginList.create([
    behead,
    {
        minDepth: 2
    }
])
