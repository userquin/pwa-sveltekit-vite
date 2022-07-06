import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [
      replace({ __DATE__: new Date().toISOString(), __RELOAD_SW__: 'false' }),
      sveltekit(),
      VitePWA({
        srcDir: './build',
        outDir: './build',
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
          globDirectory: './build/',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],
          navigateFallback: '/',
          manifestTransforms: [async (entries) => {
            console.log('upps', new Error('upps'));
            const manifest = entries.filter(({ url }) =>
              !url.endsWith('sw.js') && !url.startsWith('workbox-')
            ).map((e) => {
              let url = e.url
              if (url === 'manifest.webmanifest') {
                e.url = '/_app/immutable/manifest.webmanifest'
              }
              else if (url.endsWith('.html')) {
                if (url.startsWith('/'))
                  url = url.slice(1)

                e.url = url === 'index.html' ? '/' : `/${url.substring(0, url.lastIndexOf('.'))}`
                console.log(`${url} => ${e.url}`)
              }

              return e
            })
            return { manifest }
          }]
        }
      })
    ]
};

export default config;

