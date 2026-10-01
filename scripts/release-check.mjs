import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { compile as compileSvelte } from 'svelte/compiler';
import { parse as parseVue, compileScript, compileTemplate } from '@vue/compiler-sfc';
import { transform as compileAstro } from '@astrojs/compiler';

let components = 0;
for (const name of (await readdir('release')).sort()) {
  const root = `release/${name}`;
  const manifest = JSON.parse(await readFile(`${root}/package.json`, 'utf8'));
  assert.equal(manifest.exports['./styles.css'], './styles.min.css');
  const css = await readFile(`${root}/styles.min.css`, 'utf8');
  assert.ok(!css.includes('sourceMappingURL'));
  if (name.endsWith('-react')) assert.ok((await readFile(`${root}/react/index.min.js`, 'utf8')).startsWith('"use client";'));
  if (name.endsWith('-vanilla')) {
    const kit = name.replace(/-vanilla$/, '');
    const standard = await readFile(`${root}/browser/${kit}.js`, 'utf8');
    const minified = await readFile(`${root}/browser/${kit}.min.js`, 'utf8');
    assert.ok(minified.length < standard.length);
    assert.ok((await readFile(`${root}/styles.css`, 'utf8')).length > css.length);
    assert.equal(manifest.exports['./standard'].default, './vanilla/index.js');
  }
  for (const framework of ['svelte', 'vue', 'astro']) {
    if (!name.endsWith(`-${framework}`)) continue;
    for (const file of await readdir(`${root}/${framework}`)) {
      if (!file.endsWith(`.${framework}`)) continue;
      const filename = `${root}/${framework}/${file}`;
      const source = await readFile(filename, 'utf8');
      if (framework === 'svelte') {
        for (const generate of ['client', 'server']) compileSvelte(source, { filename, generate });
      } else if (framework === 'vue') {
        const { descriptor, errors } = parseVue(source, { filename });
        assert.deepEqual(errors, [], filename);
        compileScript(descriptor, { id: filename });
        const template = compileTemplate({ source: descriptor.template.content, filename, id: filename });
        assert.deepEqual(template.errors, [], filename);
      } else {
        const result = await compileAstro(source, { filename });
        assert.ok(result.code.length > 0, filename);
        assert.ok(!result.diagnostics?.some(diagnostic => diagnostic.severity === 1), filename);
      }
      components++;
    }
  }
}
console.log(`Release exports, minified CSS, Vanilla variants and ${components} framework components passed.`);
