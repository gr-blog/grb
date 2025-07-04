import { Image } from "@k8ts/instruments"
import { IMAGE_TAG } from "./git-info"

const grb = Image.host("ghcr.io").author("gr-blog")
function getImage(svc: string) {
    return grb.image(svc).tag(IMAGE_TAG)
}
export const grb_api = getImage(`api`)
export const grb_frontend = getImage(`frontend`)
export const grb_bot = getImage(`bot`)
