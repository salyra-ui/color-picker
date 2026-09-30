import { mkdir, cp, readFile, writeFile, readdir } from 'node:fs/promises';
const frameworks = ['react','svelte','vue','angular','astro','vanilla'];
async function rewrite(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await rewrite(path);
    else if (/\.(ts|js|svelte|vue|astro)$/.test(entry.name)) {
      let source = await readFile(path, 'utf8');
      const kit = dir.includes('color-picker') ? 'color-picker' : 'theme-kit';
      source = source.replace(/(['"])\.\.\/core(?:\/index\.js)?\1/g, `'@sebytza23/${kit}'`);
      source = source.replace(/(['"])\.\.\/vanilla\1/g, `'@sebytza23/${kit}-vanilla'`);
      await writeFile(path, source);
    }
  }
}
const availableKits = await readdir('packages');
for (const kit of ['color-picker','theme-kit'].filter(kit => availableKits.includes(kit))) {
  const base = `release/${kit}`;
  await mkdir(base, { recursive: true });
  await cp(`packages/${kit}/dist/core`, `${base}/core`, { recursive: true });
  await cp(`packages/${kit}/styles.css`, `${base}/styles.css`);
  await cp(`packages/${kit}/README.md`, `${base}/README.md`);
  if (kit === 'color-picker') await cp(`packages/${kit}/THIRD_PARTY_NOTICES.md`, `${base}/THIRD_PARTY_NOTICES.md`);
  const core = { name: `@sebytza23/${kit}`, version: '0.1.0', type: 'module', description: kit === 'color-picker' ? 'Framework independent color conversion, naming and picker state' : 'Framework independent theme generation and persistence',
    repository: { type: 'git', url: `https://github.com/sebytza23/${kit}.git` }, publishConfig: { access: 'public' },
    exports: { '.': { types: './core/index.d.ts', default: './core/index.js' }, './styles.css': './styles.css' },
    files: ['core','styles.css','README.md','THIRD_PARTY_NOTICES.md'],
    ...(kit === 'theme-kit' ? { dependencies: { '@sebytza23/color-picker': '0.1.0' } } : {}) };
  await writeFile(`${base}/package.json`, JSON.stringify(core, null, 2)+'\n');
  for (const framework of frameworks) {
    const out = `release/${kit}-${framework}`;
    await mkdir(out, { recursive: true });
    await cp(`packages/${kit}/dist/${framework}`, `${out}/${framework}`, { recursive: true });
    await writeFile(`${out}/styles.css`, (kit === 'theme-kit' ? await readFile(availableKits.includes('color-picker') ? 'packages/color-picker/styles.css' : 'node_modules/@sebytza23/color-picker/styles.css', 'utf8') : '') + await readFile(`packages/${kit}/styles.css`, 'utf8'));
    if (framework === 'vanilla') await cp(`packages/${kit}/dist/browser`, `${out}/browser`, { recursive: true });
    await rewrite(out);
    const source = `${framework}/index.${framework === 'svelte' || framework === 'vue' ? 'ts' : 'js'}`;
    const exports = { '.': { types: `./${framework}/index.${framework === 'svelte' || framework === 'vue' ? 'ts' : 'd.ts'}`, ...(framework === 'svelte' ? { svelte: `./${source}` } : {}), default: `./${source}` }, './styles.css': './styles.css' };
    if (framework === 'astro') { exports['.'] = `./astro/client.ts`; exports['./*'] = './astro/*'; exports['./client'] = './astro/client.ts'; }
    if (framework === 'vanilla') exports['./browser/*'] = './browser/*';
    const dependency = { [`@sebytza23/${kit}`]: '0.1.0', ...(kit === 'theme-kit' ? { '@sebytza23/color-picker': '0.1.0', [`@sebytza23/color-picker-${framework === 'astro' ? 'vanilla' : framework}`]: '0.1.0' } : {}), ...(framework === 'astro' ? { [`@sebytza23/${kit}-vanilla`]: '0.1.0' } : {}) };
    const peer = { react: { react: '>=18' }, svelte: { svelte: '>=5' }, vue: { vue: '>=3.5' }, angular: { '@angular/core': '>=19', '@angular/common': '>=19' }, astro: { astro: '>=5' }, vanilla: {} }[framework];
    await writeFile(`${out}/package.json`, JSON.stringify({ name: `@sebytza23/${kit}-${framework}`, version: '0.1.0', type: 'module', repository: core.repository, publishConfig: core.publishConfig, exports, files: [framework,'browser','styles.css','README.md'], sideEffects: framework === 'vanilla' || framework === 'astro' ? true : ['**/*.css'], dependencies: dependency, peerDependencies: peer }, null, 2)+'\n');
    await writeFile(`${out}/README.md`, `# @sebytza23/${kit}-${framework}\n\nInstall only this adapter and its core dependencies.\n\n\`npm install @sebytza23/${kit}-${framework}\`\n\nDocumentation: https://sebytza23.github.io/${kit}/docs.html\n\nBrowser scripts are in browser/ for vanilla HTML and PHP; no framework is required.\n`);
  }
}
console.log(`Prepared ${availableKits.filter(kit => ['color-picker','theme-kit'].includes(kit)).length * 7} independent npm packages under release/. No package was published.`);
