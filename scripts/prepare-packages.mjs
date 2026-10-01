import { cp, mkdir, readFile, writeFile, readdir, rm, rename } from 'node:fs/promises';
import { transform } from 'esbuild';
import { compactComponents } from './compact-components.mjs';

const frameworks = ['react', 'svelte', 'vue', 'angular', 'astro', 'vanilla'];
const available = await readdir('packages');
const kits = ['color-picker', 'theme-studio'].filter(kit => available.includes(kit));
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
await rm('release', { recursive: true, force: true });

async function rewrite(dir, name) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) { await rewrite(path, name); continue; }
    if (entry.name.endsWith('.map')) { await rm(path); continue; }
    if (!/\.(ts|js|svelte|vue|astro|css)$/.test(entry.name)) continue;
    const source = (await readFile(path, 'utf8'))
      .replace(/^[ \t]*\/\/[#@]\s*sourceMappingURL=.*(?:\r?\n|$)/gm, '')
      .replace(/\/\*[#@]\s*sourceMappingURL=[\s\S]*?\*\//g, '')
      .replace(/(['"])\.\.\/core(?:\/index\.js)?\1/g, `'${name}'`)
      .replace(/(['"])\.\.\/vanilla\1/g, `'${name}/vanilla'`);
    await writeFile(path, source);
  }
}

for (const kit of kits) {
  const root = `packages/${kit}`;
  const out = `release/${kit}`;
  const manifest = JSON.parse(await readFile(`${root}/package.json`, 'utf8'));
  await mkdir(out, { recursive: true });
  await cp(`${root}/dist`, `${out}/dist`, { recursive: true });
  await rm(`${out}/dist/package.json`);
  await rm(`${out}/dist/README.md`);
  await cp(`${root}/README.md`, `${out}/README.md`);
  if (kit === 'color-picker') {
    await cp(`${root}/THIRD_PARTY_NOTICES.md`, `${out}/THIRD_PARTY_NOTICES.md`);
    await rm(`${out}/dist/THIRD_PARTY_NOTICES.md`);
  }
  await rename(`${out}/dist/core/index.js`, `${out}/dist/core/index.min.js`);
  await rename(`${out}/dist/react/index.js`, `${out}/dist/react/index.min.js`);
  for (const framework of ['svelte', 'vue', 'astro']) await compactComponents(`${out}/dist/${framework}`);
  await rewrite(`${out}/dist`, manifest.name);
  const colorCss = kit === 'theme-studio'
    ? await readFile(available.includes('color-picker') ? 'packages/color-picker/styles.css' : new URL(import.meta.resolve('@salyra-ui/color-picker/styles.standard.css')), 'utf8')
    : '';
  const css = colorCss + await readFile(`${root}/styles.css`, 'utf8');
  await writeFile(`${out}/dist/styles.css`, css);
  await writeFile(`${out}/dist/styles.min.css`, (await transform(css, { loader: 'css', minify: true, sourcemap: false })).code);
  const exports = { '.': { types: './dist/core/index.d.ts', default: './dist/core/index.min.js' } };
  for (const framework of frameworks) {
    const source = `./dist/${framework}/index.${['svelte', 'vue'].includes(framework) ? 'ts' : ['react', 'vanilla'].includes(framework) ? 'min.js' : 'js'}`;
    exports[`./${framework}`] = framework === 'astro'
      ? './dist/astro/client.ts'
      : { types: `./dist/${framework}/index.${['svelte', 'vue'].includes(framework) ? 'ts' : 'd.ts'}`, ...(framework === 'svelte' ? { svelte: source } : {}), default: source };
  }
  exports['./astro/*'] = './dist/astro/*';
  exports['./astro/client'] = './dist/astro/client.ts';
  exports['./vanilla/standard'] = { types: './dist/vanilla/index.d.ts', default: './dist/vanilla/index.js' };
  exports['./browser/*'] = './dist/browser/*';
  exports['./vanilla/browser/*'] = './dist/browser/*';
  exports['./styles.css'] = './dist/styles.min.css';
  exports['./styles.min.css'] = './dist/styles.min.css';
  exports['./styles.standard.css'] = './dist/styles.css';
  delete manifest.private;
  manifest.version = version;
  manifest.description = kit === 'color-picker' ? 'Composable color controls, conversions, alpha and color naming for six frameworks' : 'Theme editing, generation, contexts, presets, persistence and selected token exports';
  manifest.repository = { type: 'git', url: `https://github.com/salyra-ui/${kit}.git` };
  manifest.publishConfig = { access: 'public' };
  manifest.exports = exports;
  manifest.files = ['dist', 'README.md', ...(kit === 'color-picker' ? ['THIRD_PARTY_NOTICES.md'] : [])];
  await writeFile(`${out}/package.json`, JSON.stringify(manifest, null, 2) + '\n');
}
console.log(`Prepared ${kits.length} Salyra UI packages with six framework subpaths. No package was published.`);
