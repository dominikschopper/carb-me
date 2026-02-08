import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    {
      style: ({ content }) => ({
        code: `@layer components {\n${content}\n}`
      })
    }
  ],
  discloseVersion: false,

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
    }),
    serviceWorker: {
      register: false, // Let PWA plugin handle registration
    },
  },
};

export default config;
