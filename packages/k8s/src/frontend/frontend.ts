import grbApi from "../api/api.js"
import { getAppMeta } from "../shared/get-app-meta.js"
import { grb_frontend } from "../shared/images.js"
import namespace from "../shared/namespace.js"
import { userGrb } from "../shared/users.js"
import { W } from "../shared/world.js"
import { Gateways } from "./gateways.js"

const name = `frontend` as const

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
                    $image: grb_frontend,
                    $ports: {
                        http: 3001
                    },
                    $env: {
                        GRB_API: grbApi["Service/api"].address("http", "http"),
                        // This is probably not implemented in the DOCKERFILE
                        ...userGrb.toDockerEnv()
                    },
                    $resources: {
                        cpu: "500m -> 2000m",
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

        yield FILE.HttpRoute("gregros-dev", {
            $backend: service.portRef("http"),
            $gateway: Gateways.gregros_dev,
            $hostname: "gregros.dev"
        })
        yield FILE.HttpRoute("gregros-xyz", {
            $backend: service.portRef("http"),
            $gateway: Gateways.gregros_xyz,
            $hostname: "gregros.xyz"
        })
        yield service
    })
