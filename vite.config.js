import { sveltekit } from '@sveltejs/kit/vite';
import { ViteSvelteKitPWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'
import { resolve } from "path";
// import SequentialPlugin from "./plugins/sequential.js";
import fg from 'fast-glob'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

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
        includeAssets: fg.sync('**/*.{png,svg,txt,webp}', { cwd: resolve(dirname, 'static') }),
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

