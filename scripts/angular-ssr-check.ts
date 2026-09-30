import { strict as assert } from 'node:assert';
import { renderAngular } from '../tests/angular-ssr';
for (const color of ['#EF4444', '#22C55E']) {
  const html = await renderAngular(color);
  assert(html.includes('--primary:'));
  assert(html.includes(color));
  assert(!html.includes('>LOADING<'));
}
console.log(
  'angular: SSR variables, projected provider context, initial picker value and request isolation passed',
);
