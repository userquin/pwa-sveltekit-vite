import adapter from '@sveltejs/adapter-auto';
// import preprocess from 'svelte-preprocess';
import { sveltekit } from '@sveltejs/kit/experimental/vite';

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit({
        // Consult https://github.com/sveltejs/svelte-preprocess
        // for more information about preprocessors
        // preprocess: preprocess(),
        adapter: adapter(),

        // Override http methods in the Todo forms
        methodOverride: {
            allowed: ['PATCH', 'DELETE']
        }
    })]
};

export default config;

