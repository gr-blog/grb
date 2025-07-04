import { Image } from "@k8ts/instruments"
import { IMAGE_SUFFIX } from "./git-info"

const grb = Image.host("registry.host").author("grb").image("grb")
export const grb_api = grb.tag(`api${IMAGE_SUFFIX}`)
export const grb_frontend = grb.tag(`frontend${IMAGE_SUFFIX}`)
export const grb_bot = grb.tag(`bot${IMAGE_SUFFIX}`)
