import remarkMath from "remark-math"
import { PluginList } from "../plugin.js"
import behead from "./behead.js"
import { canvaCodeBlockToExportedImage } from "./canva-images.js"
import { calloutPlugin } from "./obisidian-callouts.js"
export default PluginList.create([remarkMath], behead, calloutPlugin, canvaCodeBlockToExportedImage)
