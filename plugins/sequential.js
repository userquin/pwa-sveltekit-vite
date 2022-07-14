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
            const { writeBundle: _writeBundle, closeBundle: _closeBundle } = plugin
            if (_writeBundle || _closeBundle) {
                if (_writeBundle) {
                    plugin.writeBundle = async (...args) => {
                        if (active || !config.build.ssr) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            await _writeBundle.apply(this, args)
                        }
                    }
                }

                if (_closeBundle) {
                    plugin.closeBundle = async (...args) => {
                        if (activeClose || !config.build.ssr) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            await _closeBundle.apply(this, args)
                        }
                    }
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
                await plugin.writeBundle?.apply(this, [options, bundle])
            }
            if (active) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                activeClose = true
            }
            for (const plugin of plugins) {
                await plugin.closeBundle?.apply(this)
            }
            console.log(`is active: ${active}`)
        }
    }
}

