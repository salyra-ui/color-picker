import { mkdtemp, writeFile, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { build as bundle } from 'esbuild';
import { createServer, build as viteBuild } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
const consumer = await mkdtemp(join(tmpdir(), 'salyra-ui-consumer-'));
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const registry = process.argv.includes('--registry');
const dependencies = {};
for (const name of ['color-picker', 'theme-studio']) {
  const tarball = resolve(
    'artifacts/scoped/salyra-ui-' + name + '-' + version + '.tgz',
  );
  const local =
    !registry &&
    (await access(tarball).then(
      () => true,
      () => false,
    ));
  dependencies[`@salyra-ui/${name}`] = local ? `file:${tarball}` : version;
}
await writeFile(
  join(consumer, 'package.json'),
  JSON.stringify({
    private: true,
    type: 'module',
    dependencies: {
      ...dependencies,
      react: '18.3.1',
      'react-dom': '18.3.1',
      jsdom: '26.1.0',
    },
  }),
);
execFileSync(
  'npm',
  [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    ...(registry ? ['--prefer-online'] : []),
  ],
  { cwd: consumer, stdio: 'inherit' },
);
const tree = execFileSync('npm', ['ls', '--json', '--all'], {
  cwd: consumer,
  encoding: 'utf8',
});
const unwanted = new Set([
  'svelte',
  'vue',
  '@angular/core',
  '@angular/common',
  'astro',
]);
function assertOptionalPeers(node) {
  for (const [name, dependency] of Object.entries(node.dependencies ?? {})) {
    if (dependency.version) {
      assert.ok(
        !unwanted.has(name) && !name.startsWith('@sebytza23/'),
        `Unexpected installed dependency: ${name}`,
      );
      assertOptionalPeers(dependency);
    }
  }
}
assertOptionalPeers(JSON.parse(tree));
await writeFile(
  join(consumer, 'smoke.mjs'),
  `import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeStudio, ThemeProvider, ThemeMode, ThemeGenerator, generateTheme, createThemeStore } from '@salyra-ui/theme-studio/react';
import { ColorPicker, createColorStore } from '@salyra-ui/color-picker/react';
const color = createColorStore('#12345680'); assert.equal(color.getColor().name, 'Prussian Blue');
const store = createThemeStore({ theme: generateTheme('#f00'), mode: 'system', systemMode: 'dark' });
store.setName('Packed theme'); store.setColor('primary', '#00f'); assert.equal(store.getSnapshot().theme.name, 'Packed theme');
assert.ok(renderToString(h(ThemeProvider, {store}, h(ThemeMode, {value:'dark'}, 'Moon'), h(ThemeGenerator))).includes('Moon'));
const composition = renderToString(h(ThemeStudio.Root, {store}, h(ThemeStudio.Scope, {className:'own-scope'}, h(ThemeStudio.PickerRoot, {roles:['primary']}, h(ColorPicker.Input, {format:'hex',name:'brand'}), h(ThemeStudio.GeometryInput, {kind:'radius',target:'card'})))));
assert.ok(composition.includes('own-scope') && composition.includes('name="brand"'));
assert.ok(!composition.includes('fieldset'));
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<body><div id="host"></div></body>', {url:'http://localhost'});
for (const key of ['window', 'document', 'HTMLElement', 'customElements', 'CustomEvent', 'Event', 'localStorage']) globalThis[key] = dom.window[key];
const { mountThemeControls, mountThemeKit } = await import('@salyra-ui/theme-studio/vanilla');
const kit = mountThemeKit(document.querySelector('#host'), {theme:generateTheme('#6366f1'), modeStorage:false});
assert.equal(kit.getConfiguration().theme.name, generateTheme('#6366f1').name); kit.destroy();
const own = document.createElement('section'); own.innerHTML = '<input data-cp-control="input" data-format="hex" />';
const controls = mountThemeControls(own, store, {roles:['primary']});
assert.equal(own.querySelector('input').value, '#0000FF'); controls.destroy();
console.log('Fresh consumer: root helpers, React SSR, Vanilla DOM, alpha, naming, modes and custom theme names passed.');
`,
);
execFileSync(process.execPath, ['smoke.mjs'], {
  cwd: consumer,
  stdio: 'inherit',
});
await writeFile(
  join(consumer, 'react.js'),
  `export { ThemeStudio } from '@salyra-ui/theme-studio/react';`,
);
await writeFile(
  join(consumer, 'core.js'),
  `export { generateTheme } from '@salyra-ui/theme-studio';`,
);
for (const entry of ['react', 'core']) {
  const result = await bundle({
    absWorkingDir: consumer,
    entryPoints: [`${entry}.js`],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    write: false,
    metafile: true,
    minify: true,
  });
  const inputs = Object.keys(result.metafile.inputs);
  const frameworks =
    entry === 'react'
      ? ['svelte', 'vue', 'angular', 'astro', 'vanilla']
      : ['react', 'svelte', 'vue', 'angular', 'astro', 'vanilla'];
  for (const framework of frameworks)
    assert.ok(
      !inputs.some((path) => path.includes(`/dist/${framework}/`)),
      `${entry} includes ${framework}`,
    );
  assert.ok(inputs.some((path) => path.includes('/dist/core/')));
  console.log(
    `${entry}: browser bundle contains only the selected entry and its shared core (${result.outputFiles[0].contents.length} bytes).`,
  );
}
// Svelte is installed only when the consumer chooses that framework.
const svelteVersion = JSON.parse(
  await readFile('node_modules/svelte/package.json', 'utf8'),
).version;
execFileSync(
  'npm',
  [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    `svelte@${svelteVersion}`,
  ],
  { cwd: consumer, stdio: 'inherit' },
);
await writeFile(
  join(consumer, 'Consumer.svelte'),
  `<script>import { ThemeStudio, generateTheme } from '@salyra-ui/theme-studio/svelte'; import { ColorPicker } from '@salyra-ui/color-picker/svelte'; const theme = generateTheme('#5268E0');</script><ThemeStudio.Root options={{theme, mode: 'dark', modeStorage: false}}><ThemeStudio.Scope><ThemeStudio.PickerRoot roles={['primary']}><ColorPicker.Input format="hex" /><ThemeStudio.GeometryInput kind="radius" target="card" /></ThemeStudio.PickerRoot></ThemeStudio.Scope></ThemeStudio.Root>`,
);
await writeFile(
  join(consumer, 'svelte.js'),
  `export { default } from './Consumer.svelte';`,
);
const server = await createServer({
  configFile: false,
  root: consumer,
  plugins: [svelte()],
  ssr: { noExternal: [/^@salyra-ui\//] },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
try {
  const { default: component } = await server.ssrLoadModule('/Consumer.svelte');
  const { render } = await server.ssrLoadModule('svelte/server');
  assert.ok(render(component).body.includes('data-mode="dark"'));
} finally {
  await server.close();
}
const built = await viteBuild({
  configFile: false,
  root: consumer,
  plugins: [svelte()],
  logLevel: 'error',
  build: {
    write: false,
    rollupOptions: { input: join(consumer, 'svelte.js') },
  },
});
for (const chunk of built.output.filter((file) => file.type === 'chunk')) {
  for (const path of Object.keys(chunk.modules))
    for (const framework of ['react', 'vue', 'angular', 'astro', 'vanilla'])
      assert.ok(
        !path.includes(`/dist/${framework}/`),
        `Svelte bundle includes ${framework}`,
      );
}
await writeFile('artifacts/scoped/consumer-directory.txt', consumer + '\n');
console.log(
  `${registry ? 'Registry' : 'Tarballs'}: optional peers, Svelte SSR/client compilation and framework isolation passed.`,
);
