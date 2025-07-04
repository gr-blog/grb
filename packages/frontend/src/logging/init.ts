/* prettier-ignore */
import { ROARR } from "roarr"
import { formatMessage } from "./format-message"
function initRoarr(writeFunction: (message: string) => void) {
    console.log("ROARR.write is being overridden")

    ROARR.write = message => {
        writeFunction(formatMessage(message))
    }
}

initRoarr(console.log)
