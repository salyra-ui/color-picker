import { publishDocumentationVersions } from './documentation-site.mjs';
import { cp, mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { transform } from 'esbuild';
import { execFileSync } from 'node:child_process';
// A separate static entry keeps the original development demo at / intact.
await cp('dist/index.html', 'dist/react.html');
await cp('dist/site.html', 'dist/index.html');
execFileSync(
  process.execPath,
  ['node_modules/astro/astro.js', 'build', '--root', 'examples/astro'],
  { stdio: 'inherit', env: process.env },
);
await mkdir('dist/demos/astro', { recursive: true });
await cp('examples/astro/dist', 'dist/demos/astro', { recursive: true });
await mkdir('dist/downloads', { recursive: true });
for (const kit of ['color-picker', 'theme-studio']) {
  let source = `packages/${kit}/dist/browser/${kit}.js`;
  try {
    await access(source);
  } catch {
    source = new URL(
      import.meta.resolve(`@salyra-ui/${kit}/browser/${kit}.js`),
    );
  }
  await cp(source, `dist/downloads/${kit}.js`);
  const minSource =
    typeof source === 'string'
      ? source.replace(/\.js$/, '.min.js')
      : new URL(source.href.replace(/\.js$/, '.min.js'));
  await cp(minSource, `dist/downloads/${kit}.min.js`);
  let style = `release/${kit}/dist/styles.css`;
  try {
    await access(style);
  } catch {
    style = new URL(
      import.meta.resolve(`@salyra-ui/${kit}/styles.standard.css`),
    );
  }
  await cp(style, `dist/downloads/${kit}.css`);
  const css = await readFile(style, 'utf8');
  await writeFile(
    `dist/downloads/${kit}.min.css`,
    (await transform(css, { loader: 'css', minify: true, sourcemap: false }))
      .code,
  );
}
await writeFile('dist/.nojekyll', '');
const base = process.env.PAGES_BASE ?? '/';
// Normalize the legacy demos' navigation for a repository subdirectory.
for (const file of ['react.html', 'svelte.html', 'vue.html', 'angular.html']) {
  const html = await readFile('dist/' + file, 'utf8');
  await writeFile(
    'dist/' + file,
    html
      .replace('href="/"', `href="${base}react.html"`)
      .replace(/href="\/(svelte|vue|angular)\.html"/g, `href="${base}$1.html"`),
  );
}
console.log(
  `Built static marketing/docs/studio site under dist/ (base ${base}).`,
);

const manifest = JSON.parse(await readFile('package.json', 'utf8'));
if (process.env.SALYRA_FREEZE_DOCUMENTATION !== '1')
  await publishDocumentationVersions(base, manifest.version);
