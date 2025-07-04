import { Runner } from "k8ts"
import grbApi from "./api/api"
import bot from "./bot/bot"
import grbFrontend from "./frontend/frontend"
async function main() {
    const runner = new Runner({
        cwd: ".",
        outdir: ".k8ts",
        progress: {
            waitTransition: 5
        }
    })

    await runner.run([grbApi, grbFrontend, bot])
}
main()
