import { sveltekit } from '@sveltejs/kit/vite';
import { ViteSvelteKitPWA } from 'vite-plugin-pwa';
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
      ViteSvelteKitPWA({
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
        }
      }),
      // SequentialPlugin(),
    ]
};

export default config;

