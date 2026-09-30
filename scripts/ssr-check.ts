import { createServer } from 'vite';
import { strict as assert } from 'node:assert';
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
try {
  const run = await server.ssrLoadModule('/tests/framework-ssr.ts');
  for (const framework of ['svelte', 'vue']) {
    const [a, b] = await Promise.all([
      run.renderFramework(framework, '#EF4444'),
      run.renderFramework(framework, '#22C55E'),
    ]);
    assert(a.includes('--primary:'));
    assert(!a.includes('LOADING'));
    assert(a.includes('#EF4444'));
    assert(b.includes('#22C55E'));
    assert(!b.includes('#EF4444'));
    console.log(
      `${framework}: SSR variables, initial picker value and concurrent request isolation passed`,
    );
  }
} finally {
  await server.close();
}
