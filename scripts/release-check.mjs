import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import { compile as compileSvelte } from 'svelte/compiler';
import {
  parse as parseVue,
  compileScript,
  compileTemplate,
  registerTS,
} from '@vue/compiler-sfc';
import { transform as compileAstro } from '@astrojs/compiler';
registerTS(() => ts);
let components = 0;
const kits = await readdir('release');
assert.ok(kits.length >= 1 && kits.length <= 2);
for (const kit of kits) {
  const root = `release/${kit}`;
  const manifest = JSON.parse(await readFile(`${root}/package.json`, 'utf8'));
  assert.equal(manifest.name, `@salyra-ui/${kit}`);
  assert.equal(manifest.exports['./styles.min.css'], './dist/styles.min.css');
  assert.equal(manifest.exports['./styles.css'], './dist/styles.min.css');
  for (const framework of [
    'react',
    'svelte',
    'vue',
    'angular',
    'astro',
    'vanilla',
  ]) {
    assert.ok(manifest.exports[`./${framework}`]);
    const exp = manifest.exports[`./${framework}`];
    for (const file of typeof exp === 'string' ? [exp] : Object.values(exp))
      assert.ok((await stat(`${root}/${file}`)).isFile());
  }
  for (const [peer, meta] of Object.entries(manifest.peerDependenciesMeta))
    assert.equal(meta.optional, true, peer);
  assert.deepEqual(
    Object.keys(manifest.dependencies),
    kit === 'color-picker' ? [] : ['@salyra-ui/color-picker'],
  );
  const css = await readFile(`${root}/dist/styles.min.css`, 'utf8');
  assert.ok(
    (await readFile(`${root}/dist/styles.css`, 'utf8')).length > css.length,
  );
  assert.ok(css.includes('.cp-'));
  if (kit === 'theme-studio') assert.ok(css.includes('.tk-'));
  assert.ok(
    (await readFile(`${root}/dist/react/index.min.js`, 'utf8')).startsWith(
      '"use client";',
    ),
  );
  const standard = await readFile(`${root}/dist/browser/${kit}.js`, 'utf8');
  assert.ok(
    (await readFile(`${root}/dist/browser/${kit}.min.js`, 'utf8')).length <
      standard.length,
  );
  assert.equal(
    manifest.exports['./vanilla/standard'].default,
    './dist/vanilla/index.js',
  );
  for (const framework of ['svelte', 'vue', 'astro'])
    for (const file of await readdir(`${root}/dist/${framework}`)) {
      if (!file.endsWith(`.${framework}`)) continue;
      const filename = `${root}/dist/${framework}/${file}`,
        source = await readFile(filename, 'utf8');
      if (framework === 'svelte')
        for (const generate of ['client', 'server'])
          compileSvelte(source, { filename, generate });
      else if (framework === 'vue') {
        const { descriptor, errors } = parseVue(source, { filename });
        assert.deepEqual(errors, []);
        compileScript(descriptor, {
          id: filename,
          fs: {
            fileExists: existsSync,
            readFile: (path) => readFileSync(path, 'utf8'),
          },
        });
        assert.deepEqual(
          compileTemplate({
            source: descriptor.template.content,
            filename,
            id: filename,
          }).errors,
          [],
        );
      } else {
        const result = await compileAstro(source, { filename });
        assert.ok(result.code.length > 0);
        assert.ok(!result.diagnostics?.some((d) => d.severity === 1));
      }
      components++;
    }
}
console.log(
  `${kits.length} package exports, optional peers, minified files, Vanilla variants and ${components} framework components passed.`,
);
