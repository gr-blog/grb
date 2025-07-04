import { api } from "k8ts/kinds"
import { W } from "../shared/world"

export namespace Gateways {
    export const gregros_dev = W.External(api.gateway_.v1_.Gateway, "gregros-dev", "gateways")
    export const gregros_xyz = W.External(api.gateway_.v1_.Gateway, "gregros-xyz", "gateways")
}
