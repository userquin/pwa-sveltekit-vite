import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

/** @type {import('vite').UserConfig} */
const config = {
    logLevel: 'info',
    build: {
      minify: false,
    },
    plugins: [
      replace({ __DATE__: new Date().toISOString(), __RELOAD_SW__: 'false' }),
      sveltekit(),
      VitePWA({
        srcDir: './src',
        outDir: './.svelte-kit/output/client',
        mode: 'development',
        includeManifestIcons: false,
        scope: '/',
        base: '/',
        manifest: {
          short_name: "PWA Router",
          name: "PWA Router",
          start_url: "/",
          scope: "/",
          display: "standalone",
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
          dontCacheBustURLsMatching: /-[a-f0-9]{8}\./,
          modifyURLPrefix: {
            'client/': '/',
            'prerendered/pages/': '/'
          },
          globDirectory: '.svelte-kit/output',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],
          navigateFallback: '/',
          manifestTransforms: [async (entries) => {
            console.log(entries)
            const manifest = entries.filter(({ url }) =>
              !url.endsWith('sw.js') && !url.startsWith('workbox-') && !url.startsWith('server/') && url !== 'manifest.webmanifest'
            ).map((e) => {
              let url = e.url
              console.log(url)
              if (url.endsWith('.html')) {
                if (url.startsWith('/'))
                  url = url.slice(1)

                e.url = url === 'index.html' ? '/' : `/${url.slice(0, url.lastIndexOf('.'))}`
                console.log(`${url} => ${e.url}`)
              }

              return e
            })
            console.log(manifest)
            return { manifest }
          }]
        }
      })
    ]
};

export default config;

