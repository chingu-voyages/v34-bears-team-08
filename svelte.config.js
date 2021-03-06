import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-netlify'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    vite: {
      resolve: {
        alias: {
          $components: path.resolve('src/lib/components/'),
        },
      },
    },
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
  experimental: {
    // Enable prebundling Svelte component deps (esp. icons).
    // See: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#prebundlesveltelibraries
    prebundleSvelteLibraries: true,
  },
}

export default config
