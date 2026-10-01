import { defineConfig } from 'astro/config';
export default defineConfig({
  base: `${process.env.PAGES_BASE ?? "/"}demos/astro/`,
  server: { host: '127.0.0.1', port: 4318 },
  vite: { ssr: { noExternal: [/^@salyra-ui\//] }, server: { fs: { allow: ['../..'] } } },
});
