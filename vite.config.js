import { sveltekit } from '@sveltejs/kit/experimental/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [
      replace({ __DATE__: new Date().toISOString(), __RELOAD_SW__: 'false' }),
      sveltekit(),
      VitePWA({
        srcDir: './build',
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
          ]
        },
        devOptions: {
          enabled: true,
          /* when using generateSW the PWA plugin will switch to classic */
          type: 'module',
          navigateFallback: '/',
          webManifestUrl: '/_app/manifest.webmanifest'
        },
      })
    ]
};

export default config;

