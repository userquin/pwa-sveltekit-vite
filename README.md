# create-svelte

Awaiting https://github.com/antfu/vite-plugin-pwa/issues/324

To make PWA Plugin run on build, find `node_modules/.pnpm/vite-plugin-pwa@0.12.3_vite@2.9.14/node_modules/vite-plugin-pwa/dist/index.js` and locate line 507, then paste the following code before the `closeBundle` method:

```ts
async writeBundle() {
    // add support for new SvelteKit Vite Plugin
    if (!ctx.options.disable && !ctx.viteConfig.build.ssr) {
        isSvelteKitPresent = !!ctx.viteConfig.plugins.find(p => p.name === 'vite-plugin-svelte-kit');
    }

    if (ctx.viteConfig.build.ssr && isSvelteKitPresent) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await _generateSW(ctx);
    }
},
```

Then patch also the `closeBundle` with (just add `!isSvelteKitPresent && ` to the if statement):
```ts
async closeBundle() {
  if (!isSvelteKitPresent && !ctx.viteConfig.build.ssr && !ctx.options.disable)
    await _generateSW(ctx);
},
```

You must also add this in line 486 before the comment:
```ts
let isSvelteKitPresent = false;
// src/plugins/build.ts
function BuildPlugin(ctx) {
```


Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
