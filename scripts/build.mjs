import { build } from 'esbuild';
import { mkdir, cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
execFileSync(
  process.execPath,
  ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.build.json'],
  { stdio: 'inherit' },
);
execFileSync(
  process.execPath,
  [
    'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js',
    '-p',
    'tsconfig.angular.json',
  ],
  { stdio: 'inherit' },
);
const availableKits = await readdir('packages');
for (const name of ['color-picker', 'theme-kit'].filter(name => availableKits.includes(name))) {
  const root = `packages/${name}`,
    out = `${root}/dist`;
  await mkdir(out, { recursive: true });
  await build({
    entryPoints: [`${root}/core/index.ts`],
    outfile: `${out}/core/index.js`,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    packages: 'external',
    sourcemap: true,
  });
  await build({
    entryPoints: [`${root}/react/index.tsx`],
    outfile: `${out}/react/index.js`,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    packages: 'external',
    external: ['../core'],
    jsx: 'automatic',
    banner: { js: '"use client";' },
    sourcemap: true,
  });
  await mkdir(`${out}/browser`, { recursive: true });
  await build({ entryPoints: [`${root}/vanilla/index.ts`], outfile: `${out}/vanilla/index.js`, bundle: true,
    format: 'esm', platform: 'browser', target: 'es2022', packages: 'external', external: ['../core'], sourcemap: true });
  await build({ entryPoints: [`${root}/vanilla/index.ts`], outfile: `${out}/browser/${name}.js`, bundle: true,
    format: 'iife', globalName: name === 'color-picker' ? 'ColorPicker' : 'ThemeKit', platform: 'browser', target: 'es2022', minify: true });
  await cp(`.types-build/${name}/vanilla`, `${out}/vanilla`, { recursive: true });
  await cp(`.types-build/${name}/core`, `${out}/core`, { recursive: true });
  await cp(`.types-build/${name}/react`, `${out}/react`, { recursive: true });
  await cp(`.angular-build/packages/${name}/angular`, `${out}/angular`, {
    recursive: true,
  });
  for (const folder of ['svelte', 'vue', 'astro'])
    await cp(`${root}/${folder}`, `${out}/${folder}`, { recursive: true });
  await cp(`${root}/styles.css`, `${out}/styles.css`);
  await cp(`${root}/README.md`, `${out}/README.md`);
  if (name === 'color-picker')
    await cp(`${root}/THIRD_PARTY_NOTICES.md`, `${out}/THIRD_PARTY_NOTICES.md`);
  // Keep compiled ESM usable in Node SSR without directory-specifier resolution.
  for (const folder of ['core', 'react', 'angular', 'vanilla'])
    for (const entry of await readdir(`${out}/${folder}`)) {
      if (!entry.endsWith('.js') && !entry.endsWith('.d.ts')) continue;
      const file = `${out}/${folder}/${entry}`;
      const source = await readFile(file, 'utf8');
      await writeFile(
        file,
        source.replace(
          /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
          (_, a, path, z) =>
            `${a}${path.endsWith('/core') ? path + '/index.js' : /\.[a-z]+$/.test(path) ? path : path + '.js'}${z}`,
        ),
      );
    }
  const manifest = JSON.parse(await readFile(`${root}/package.json`, 'utf8'));
  delete manifest.private;
  delete manifest.files;
  manifest.exports['.'] = {
    types: './core/index.d.ts',
    default: './core/index.js',
  };
  manifest.exports['./react'] = {
    types: './react/index.d.ts',
    default: './react/index.js',
  };
  manifest.exports['./vanilla'] = { types: './vanilla/index.d.ts', default: './vanilla/index.js' };
  manifest.exports['./angular'] = {
    types: './angular/index.d.ts',
    default: './angular/index.js',
  };
  manifest.exports['./svelte'] = {
    types: './svelte/index.ts',
    svelte: './svelte/index.ts',
    default: './svelte/index.ts',
  };
  await writeFile(
    `${out}/package.json`,
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(`Built ${name} independently → ${out}`);
}
