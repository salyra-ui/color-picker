import { mkdtemp, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vue from '@vitejs/plugin-vue';
const root = await mkdtemp(join(tmpdir(), 'salyra-bundles-'));
const kits = ['color-picker', 'theme-studio'];
const available = await readdir('release');
const frameworks = ['react', 'svelte', 'vue', 'angular', 'astro', 'vanilla'];
const aliases = [];
for (const kit of kits) {
  if (!available.includes(kit)) continue;
  const manifest = JSON.parse(
    await readFile(`release/${kit}/package.json`, 'utf8'),
  );
  for (const path of ['.', ...frameworks.map((f) => './' + f)]) {
    const entry = manifest.exports[path];
    const file =
      typeof entry === 'string' ? entry : (entry?.svelte ?? entry?.default);
    if (file)
      aliases.push({
        find: new RegExp(
          '^@salyra-ui/' +
            kit +
            (path === '.' ? '' : '/' + path.slice(2)) +
            '$',
        ),
        replacement: resolve('release', kit, file),
      });
  }
}
let limits = {};
try {
  limits = JSON.parse(await readFile('scripts/bundle-budgets.json', 'utf8'));
} catch {
  if (!process.argv.includes('--record')) throw Error('Missing bundle budgets');
}
const measured = {},
  failures = [];
try {
  for (const kit of available)
    for (const framework of frameworks) {
      const key = kit + '/' + framework;
      const entry = join(root, kit + '-' + framework + '.js');
      const names =
        framework === 'astro' || framework === 'vanilla'
          ? kit === 'color-picker'
            ? 'mountColorPicker'
            : 'mountThemeKit'
          : kit === 'color-picker'
            ? 'ColorProvider, ColorArea, ColorInput'
            : 'ThemeProvider, ThemePicker';
      await writeFile(
        entry,
        `export { ${names} } from '@salyra-ui/${kit}/${framework}';`,
      );
      const result = await build({
        configFile: false,
        root: process.cwd(),
        logLevel: 'error',
        plugins: [react(), svelte(), vue()],
        resolve: { alias: aliases },
        build: {
          write: false,
          minify: true,
          sourcemap: false,
          lib: { entry, formats: ['es'] },
          rollupOptions: {
            external: (id) =>
              /^(react(?:\/|$)|react-dom(?:\/|$)|svelte(?:\/|$)|vue(?:\/|$)|@angular\/)/.test(
                id,
              ),
          },
        },
      });
      const output = (Array.isArray(result) ? result : [result])
        .flatMap((r) => r.output)
        .filter((o) => o.type === 'chunk')
        .map((o) => o.code)
        .join('\n');
      const bytes = gzipSync(output).length;
      measured[key] = bytes;
      if (process.argv.includes('--record'))
        limits[key] = Math.ceil((bytes * 1.15) / 1024) * 1024;
      else if (!limits[key] || bytes > limits[key])
        failures.push(`${key}: ${bytes} > ${limits[key]} gzip bytes`);
      console.log(`${key}: ${bytes} gzip bytes (limit ${limits[key]})`);
    }
  if (process.argv.includes('--record'))
    await writeFile(
      'scripts/bundle-budgets.json',
      JSON.stringify(limits, null, 2) + '\n',
    );
  if (failures.length) throw Error(failures.join('\n'));
  console.log(
    'Framework runtimes are external. Measurements include Salyra core and the selected component graph.',
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
