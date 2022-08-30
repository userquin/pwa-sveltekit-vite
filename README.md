# SvelteKit, Vite 3 and PWA Plugin

**UPDATED to Vite 3.1-beta1 and latest SvelteKit 1.0.0-next.454**:
- patching manually `VitePluginPWA` to configure the new `Rollup` sequential hook in `closeBundle`: check the `vite.config.js` module
- migrated project with `pnpm dlx svelte-migrate routes`

**WARNING - DON'T USE THIS**: we're awating Rollup and Vite to add sequential parallel hooks support:
- RFC: https://github.com/vitejs/vite/discussions/9442
- Rollup PR (Lukas Taegert-Atkinson and Anthony Fu): https://github.com/rollup/rollup/pull/4600
- Vite PR (Anthony Fu): https://github.com/vitejs/vite/pull/9634

Finally!, it works.

Using a local build of the PWA PR: https://github.com/antfu/vite-plugin-pwa/pull/327.

If you had a previous version, just remove the `node_modules` and run `pnpm install`.

To test it just run:
- `pnpm run build && pnpm run preview` or
- `pnpm run build && pnpm run https` to test with https
