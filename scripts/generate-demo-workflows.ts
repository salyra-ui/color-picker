import { mkdirSync, writeFileSync } from 'node:fs';
import {
  controllerSource,
  recipeSource,
  recipeStyles,
} from '../examples/docs/recipes';
import type { Kit } from '../examples/docs/snippets';
const target = 'examples/workflows';
mkdirSync(target, { recursive: true });
for (const kit of ['color-picker', 'theme-studio'] as Kit[]) {
  const prefix = kit === 'color-picker' ? 'Color' : 'Theme';
  writeFileSync(
    `${target}/${prefix.toLowerCase()}-controller.ts`,
    controllerSource(kit),
  );
  for (const integration of [
    'React',
    'Svelte',
    'Vue',
    'Angular',
    'Astro',
  ] as const) {
    const extension = (
      {
        React: 'tsx',
        Svelte: 'svelte',
        Vue: 'vue',
        Angular: 'ts',
        Astro: 'astro',
      } as const
    )[integration];
    let source = recipeSource(kit, integration)
      .replaceAll('./controller', `./${prefix.toLowerCase()}-controller`)
      .replaceAll('./recipe.css', './workflow.css');
    if (integration === 'Angular')
      source = source
        .replace(
          "selector: 'app-root'",
          `selector: '${prefix.toLowerCase()}-workflow'`,
        )
        .replace('export class App', `export class ${prefix}Workflow`);
    writeFileSync(`${target}/${prefix}${integration}.${extension}`, source);
  }
}
writeFileSync(
  `${target}/workflow.css`,
  recipeStyles +
    `\n.native-workflows { margin-top: 48px; }\n.native-workflows > h2 { font-size: 28px; letter-spacing: -.04em; }\n.native-workflow-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }\n.native-workflow-card { background:#fff; border:1px solid #d0d6d1; padding:24px; min-width:0; }\n.native-workflow-card > h3 { margin:0 0 12px; font-size:20px; }\n.native-workflow-card > p { font-size:13px; line-height:1.6; color:#555; margin-bottom:24px; }\n.native-workflow-card .recipe { max-width:none; }\n.native-workflow-card .recipe label { flex-wrap:wrap; }\n.native-workflow-card .recipe-output { font-size:12px; }\n@media(max-width:900px){.native-workflow-grid{grid-template-columns:1fr;}}`,
);
