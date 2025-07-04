import { api } from "k8ts/kinds"
import bot from "../bot/bot.js"
import { getAppMeta } from "../shared/get-app-meta.js"
import { grb_api } from "../shared/images.js"
import namespace from "../shared/namespace.js"
import { userGrb } from "../shared/users.js"
import { W } from "../shared/world.js"

const name = `api` as const

const secret_moosend = W.External(api.v1_.Secret, "moosend", "grb")
const secret_github = W.External(api.v1_.Secret, "github", "grb")
export default W.Scope(namespace)
    .File(`${name}.yaml`)
    .metadata(getAppMeta(name))
    .Resources(function* FILE(FILE) {
        const deploy = FILE.Deployment(name, {
            replicas: 1
        })
            .Template()
            .POD(function* POD(POD) {
                const addr = bot["Service/bot"].address("http", "http") as string
                yield POD.Container(name, {
                    $image: grb_api,
                    $ports: {
                        http: 3000
                    },
                    $env: {
                        DATA_SOURCE: "github",
                        BOT_API: addr,
                        API_KEY_MOOSEND: {
                            $ref: secret_moosend,
                            key: "API_KEY_MOOSEND"
                        },
                        GITHUB_TOKEN: {
                            $ref: secret_github,
                            key: "GITHUB_TOKEN"
                        },
                        // This is probably not implemented in the DOCKERFILE
                        ...userGrb.toDockerEnv()
                    },
                    $resources: {
                        cpu: "100m -> 500m",
                        memory: "500Mi -> 500Mi"
                    }
                })
            })

        const service = FILE.Service(name, {
            $backend: deploy,
            $ports: {
                http: 80
            },
            $frontend: {
                type: "ClusterIP"
            }
        })
        yield service
    })
