/** @type {import('vite').Plugin} */
export default function SequentialPlugin() {
    /** @type {import('vite').ResolvedConfig} */
    let config

    let active = false
    let activeClose = false

    /** @type {import('vite').Plugin[]} */
    const plugins = []

    function changeToSequentialPlugin(plugin) {
        if (plugin.name !== 'vite-sequential-plugin') {
            const { writeBundle, closeBundle } = plugin
            if (writeBundle || closeBundle) {
                if (writeBundle) {
                    plugin._writeBundle = async (...args) => {
                        if (active || !config.build.ssr) {
                            config.build.ssr && console.log(`CALLING: ${plugin.name}`)
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            await writeBundle.apply(this, args)
                        }
                    }
                    delete plugin.writeBundle
                }

                if (closeBundle) {
                    plugin._closeBundle = async (...args) => {
                        if (activeClose || !config.build.ssr) {
                            config.build.ssr && console.log(`CALLING: ${plugin.name}`)
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            await closeBundle.apply(this, args)
                        }
                    }
                    delete plugin.closeBundle
                }
                plugins.push(plugin)
            }
        }
    }

    return {
        name: 'vite-sequential-plugin',
        enforce: 'post',
        config(config) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            config.plugins?.flat(Infinity).forEach(changeToSequentialPlugin)
        },
        configResolved(_config) {
            config = _config
        },
        async writeBundle(options, bundle) {
            active = config.build.ssr
            for (const plugin of plugins) {
                await plugin._writeBundle?.apply(this, [options, bundle])
            }
            if (active) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                activeClose = true
            }
            for (const plugin of plugins) {
                await plugin._closeBundle?.apply(this)
            }
            console.log(`is active: ${active}`)
        }
    }
}

