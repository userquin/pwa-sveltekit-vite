# SvelteKit, Vite 3 and PWA Plugin

Finally!, it works.

Using a local build of the PWA PR: https://github.com/antfu/vite-plugin-pwa/pull/327.

If you had a previous version, just remove the `node_modules` and run `pnpm install`.

To test it just run:
- `pnpm run build && pnpm run preview` or
- `pnpm run build && pnpm run https` to test with https
