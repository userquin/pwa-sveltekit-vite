import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

function configureOptions(viteOptions, options) {
  const {
    base = viteOptions.build.base ?? '/',
    adapterFallback,
    outDir = '.svelte-kit',
  } = options.integration ?? {}

  // Vite will copy public folder to the globDirectory after pwa plugin runs:
  // globDirectory is the build folder.
  // SvelteKit will copy to the globDirectory before pwa plugin runs (via Vite client build in writeBundle hook):
  // globDirectory is the kit client output folder.
  // We need to disable includeManifestIcons: any icon in the static folder will be twice in the sw's precache manifest.
  if (typeof options.includeManifestIcons === 'undefined')
    options.includeManifestIcons = false

  let config

  if (options.strategies === 'injectManifest') {
    options.injectManifest = options.injectManifest ?? {}
    config = options.injectManifest
  }
  else {
    options.workbox = options.workbox ?? {}
    if (!options.workbox.navigateFallback)
      options.workbox.navigateFallback = adapterFallback ?? base

    config = options.workbox
  }

  // SvelteKit outDir is `.svelte-kit/output/client`.
  // We need to include the parent folder since SvelteKit will generate SSG in `.svelte-kit/output/prerendered` folder.
  if (!config.globDirectory)
    config.globDirectory = `${outDir}/output`

  if (!config.modifyURLPrefix)
    config.globPatterns = buildGlobPatterns(config.globPatterns)

  // Vite generates <name>.<hash>.<ext> layout while SvelteKit generates <name>-<hash>.<ext> (Rollup default)
  // Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work
  if (!config.dontCacheBustURLsMatching)
    config.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./

  if (!config.manifestTransforms)
    config.manifestTransforms = [createManifestTransform(base, options.svelteKitOptions)]
}

function createManifestTransform(base, options) {
  return async (entries) => {
    const suffix = options?.trailingSlash === 'always' ? '/' : ''
    let adapterFallback = options?.adapterFallback
    let excludeFallback = false
    // the fallback will be always generated by SvelteKit.
    // The adapter will copy the fallback only if it is provided in its options: we need to exclude it
    if (!adapterFallback) {
      adapterFallback = 'prerendered/fallback.html'
      excludeFallback = true
    }

    const manifest = entries.filter(({ url }) => !(excludeFallback && url === adapterFallback)).map((e) => {
      let url = e.url
      // client assets in `.svelte-kit/output/client` folder.
      // SSG pages in `.svelte-kit/output/prerendered/pages` folder.
      // fallback page in `.svelte-kit/output/prerendered` folder (fallback.html is the default).
      if (url.startsWith('client/'))
        url = url.slice(7)
      else if (url.startsWith('prerendered/pages/'))
        url = url.slice(18)
      else if (url.startsWith('prerendered/'))
        url = url.slice(12)

      if (url.endsWith('.html')) {
        if (url.startsWith('/'))
          url = url.slice(1)

        e.url = url === 'index.html' ? `${base}` : `${base}${url.slice(0, url.lastIndexOf('.'))}${suffix}`
      }
      else {
        e.url = url
      }

      return e
    })

    return { manifest }
  }
}

function buildGlobPatterns(globPatterns) {
  if (globPatterns) {
    if (!globPatterns.some(g => g.startsWith('prerendered/')))
      globPatterns.push('prerendered/**/*.html')

    if (!globPatterns.some(g => g.startsWith('client/')))
      globPatterns.push('client/**/*.{js,css,ico,png,svg,webp}')

    return globPatterns
  }

  return ['client/**/*.{js,css,ico,png,svg,webp}', 'prerendered/**/*.html']
}

/** @type {import('vite-plugin-pwa').VitePWAOptions} */
const pwa/*[main, build, dev]*/ = VitePWA({
  srcDir: './src',
  mode: 'development',
  scope: '/',
  base: '/',
  manifest: {
    short_name: 'PWA Router',
    name: 'PWA Router',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
  },
  integration: {
    closeBundleOrder: 'pre',
    configureOptions,
  }
})

/*
const { closeBundle, ...rest } = build

delete build.closeBundle

*/
/** @type {import('vite').UserConfig} */
const config = {
    logLevel: 'info',
    build: {
      minify: false,
    },
    plugins: [
      replace({ __DATE__: new Date().toISOString(), __RELOAD_SW__: 'false' }),
      sveltekit(),
      pwa,
/*      [main, {
        ...rest,
        closeBundle: {
          sequential: true,
          order: 'pre',
          async handler() {
            await closeBundle.apply(this)
          },
        }
      }, dev],*/
    ]
};

export default config;

