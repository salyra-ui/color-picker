import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { draftScopeExample } from '../examples/docs/scope-recipes';
// Check the exact copyable recipes with the real framework compilers in npm run check.
for (const [integration, path] of [
  ['React', 'examples/react/DraftScope.tsx'],
  ['Svelte', 'examples/svelte/DraftScope.svelte'],
  ['Vue', 'examples/vue/DraftScope.vue'],
  ['Angular', 'examples/angular/draft-scope.component.ts'],
  ['Astro', 'examples/astro/src/components/DraftScope.astro'],
] as const) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, draftScopeExample(integration) + '\n');
}
