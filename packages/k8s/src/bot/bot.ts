import { api } from "k8ts/kinds"
import grbApi from "../api/api.js"
import { getAppMeta } from "../shared/get-app-meta.js"
import { grb_bot } from "../shared/images.js"
import namespace from "../shared/namespace.js"
import { userGrb } from "../shared/users.js"
import { W } from "../shared/world.js"

const name = `bot` as const
const secret_discord = W.External(api.v1_.Secret, "discord", "grb")
export default W.Scope(namespace)
    .File(`${name}.yaml`)
    .metadata(getAppMeta(name))
    .Resources(function* FILE(FILE) {
        const deploy = FILE.Deployment(name, {
            replicas: 1
        })
            .Template()
            .POD(function* POD(POD) {
                yield POD.Container(name, {
                    $image: grb_bot,
                    $ports: {
                        http: 3002
                    },
                    $env: {
                        CHANNEL_ID_DEV_DATA: "1330198621895000106",
                        CHANNEL_ID_XYZ_DATA: "1387503192425631804",
                        CHANNEL_ID_ANNOUNCE: "1330205076006109325",
                        TOKEN_DISCORD: {
                            $ref: secret_discord,
                            key: "DISCORD_TOKEN"
                        },
                        MOCK_DISCORD: "false",
                        URL_GRB_API: grbApi["Service/api"].address("http", "http") as string,
                        DB_ENTRY_HEADER: "GRB_API_v3",
                        ANNOUNCE_CUTOFF: "7d",
                        // This is probably not implemented in the DOCKERFILE
                        ...userGrb.toDockerEnv()
                    },
                    $resources: {
                        cpu: "100m -> 250m",
                        memory: "200Mi -> 300Mi"
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
