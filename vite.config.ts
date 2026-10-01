import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  base: process.env.PAGES_BASE ?? '/',
  ssr: { noExternal: [/^@salyra-ui\//] },
  // Dependency prebundling can traverse the sibling workspace's Angular sources.
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: { compilerOptions: { experimentalDecorators: true } },
    },
  },
  plugins: [react(), svelte(), vue()],
  server: { port: 4317, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        docs: 'docs.html',
        site: 'site.html',
        generator: 'generator.html',
        color: 'color.html',
        svelte: 'svelte.html',
        vue: 'vue.html',
        angular: 'angular.html',
      },
    },
  },
});
