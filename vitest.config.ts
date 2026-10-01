import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}', 'packages/*/tests/**/*.test.ts'],
    environment: 'node',
    server: { deps: { inline: [/@salyra-ui\//] } },
  },
});
