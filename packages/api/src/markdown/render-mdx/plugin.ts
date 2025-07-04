export type PluginFunction<Options> = (this: any, options?: Options) => any

export type getOptionsTypeFromPlugin<T> =
    T extends PluginFunction<infer Options> ? Exclude<Options, null | undefined | void> : never

export function plugin<PluginF extends PluginFunction<any>>(
    arr: [plugin: PluginF, options: getOptionsTypeFromPlugin<PluginF>]
) {
    return arr
}

export class PluginList {
    private _plugins: Array<[PluginFunction<any>, object?]> = []

    static create<PluginFs extends PluginFunction<any>[]>(
        ...plugins: {
            [K in keyof PluginFs]:
                | [PluginFs[K], getOptionsTypeFromPlugin<PluginFs[K]>?]
                | PluginList
        }
    ): PluginList {
        const list = new PluginList()
        list.add(...plugins)
        return list
    }

    add<PluginFs extends PluginFunction<any>[]>(
        ...plugins: {
            [K in keyof PluginFs]:
                | [PluginFs[K], getOptionsTypeFromPlugin<PluginFs[K]>?]
                | PluginList
        }
    ): this {
        for (const plugin of plugins) {
            if (plugin instanceof PluginList) {
                this._plugins.push(...plugin.get())
                continue
            }
            this._plugins.push(plugin)
        }
        return this
    }

    get() {
        return this._plugins as Array<[PluginFunction<any>, object?]>
    }
}
