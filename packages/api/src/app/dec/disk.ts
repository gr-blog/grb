import { Provider } from "@nestjs/common"
import { resolve } from "path"

export const DATA_SOURCE = Symbol("DATA_SOURCE")
export type DataSource_GitHub = {
    type: "github"
}
export type DataSource_Local = {
    type: "local"
    path: string
}
export type DataSource = DataSource_GitHub | DataSource_Local
export const DataSourceProvider: Provider<DataSource> = {
    provide: DATA_SOURCE,
    useFactory() {
        const ds = process.env.DATA_SOURCE || "github"
        if (ds === "github") {
            return {
                type: "github"
            }
        }
        let dir = ds === "sample" ? "./sample-data" : ds

        return {
            type: "local",
            path: resolve(dir).replace(/\\/g, "/")
        }
    }
}
