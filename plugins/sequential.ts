import type {Plugin, ResolvedConfig} from 'vite'

export default function SequentialPlugin(): Plugin {
    let config: ResolvedConfig

    let active = false

    const plugins: Plugin[] = []

    function changeToPlugin(plugin: Plugin) {
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
                        if (active || !config.build.ssr) {
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
            config.plugins?.flat(Infinity).forEach(changeToPlugin)
        },
        configResolved(_config) {
          config = _config
        },
        async writeBundle(options, bundle) {
            active = true
            for (const plugin of plugins) {
                await plugin.writeBundle?.apply(this, [options, bundle])
            }
            for (const plugin of plugins) {
                await plugin.closeBundle?.apply(this)
            }
            console.log('PASO!!!')
        }
    }
}

