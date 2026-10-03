import { cp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
for (const kit of ['color-picker', 'theme-studio']) {
  const target = join(
    homedir(),
    'Documents',
    kit === 'color-picker' ? 'color-picker' : 'theme-kit-github',
  );
  for (const name of await readdir(join(target, 'packages')))
    await rm(join(target, 'packages', name), { recursive: true, force: true });
  await cp(`packages/${kit}`, join(target, 'packages', kit), {
    recursive: true,
    filter: (source) => !source.split('/').includes('dist'),
  });
  for (const folder of [
    'examples',
    'tests',
    'scripts',
    '.github',
    'public',
    'documentation',
  ])
    await cp(folder, join(target, folder), {
      recursive: true,
      filter: (source) =>
        !['dist', 'node_modules', '.astro'].some((part) =>
          source.split('/').includes(part),
        ),
    });
  await rm(join(target, 'scripts/split-packages.mjs'), { force: true });
  for (const file of ['CHANGELOG.md', '.gitattributes', '.prettierignore'])
    await cp(file, join(target, file));
  for (const file of await readdir('.'))
    if (
      /^(tsconfig.*\.json|.*\.html|.*config.*\.(?:ts|js|mjs|cjs))$/.test(file)
    )
      await cp(file, join(target, file));
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  manifest.name = `salyra-ui-${kit}-workspace`;
  const other = kit === 'color-picker' ? 'theme-studio' : 'color-picker';
  delete manifest.dependencies;
  const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
  lock.name = manifest.name;
  lock.packages[''].name = manifest.name;
  await writeFile(
    join(target, 'package-lock.json'),
    JSON.stringify(lock, null, 2) + '\n',
  );
  await writeFile(
    join(target, '.gitignore'),
    (await readFile('.gitignore', 'utf8')) +
      `\n.peer/\npackages/${other}/\nrelease/\nartifacts/\n`,
  );
  await writeFile(
    join(target, 'package.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  await writeFile(
    join(target, 'README.md'),
    `# Salyra UI / ${kit}\n\nComponents in harmony with your stack.\n\nVersion 1.0.0 includes context roots, native controls and application-owned markup. Use the ready components or compose your own editor. See the package README for the API and framework examples.\n\n## Install\n\n\`npm install @salyra-ui/${kit}\`\n\nChoose a framework entry: \`@salyra-ui/${kit}/svelte\`, \`/react\`, \`/vue\`, \`/angular\`, \`/astro\` or \`/vanilla\`. The package root exports framework-independent helpers. Framework peers are optional. Import \`@salyra-ui/${kit}/styles.min.css\` once for the default styles.\n\nEach npm package contains built runtime files, declarations, compact framework compiler inputs and CSS under dist, with no sourcemaps. Vanilla includes standard and minified JS/CSS variants. Theme studio depends on color picker.\n\n## Development\n\nUse Node 22.19 or newer. Run \`npm run prepare:peer\` and \`npm ci\`, \`npm test\`, \`npm run check\`, \`npm run check:docs\`, \`npm run test:ssr\`, \`npm run pack:all\`, \`npm run check:release\` and \`npm run build:site\`.\n\nThis repository contains only ${kit}. Before installing development dependencies, prepare:peer checks out the same branch of the other repository into an ignored directory for shared integration checks. Set SALYRA_PEER_REF to choose another matching peer branch. npm consumers only install the published packages.\n\n[Documentation](https://salyra-ui.github.io/${kit}/docs.html?kit=${kit}) · [Examples](https://salyra-ui.github.io/${kit}/${kit === 'color-picker' ? 'color' : 'generator'}.html)\n\n[Package API and migration](packages/${kit}/README.md)\n`,
  );
  console.log(`Prepared ${target} for https://github.com/salyra-ui/${kit}`);
}
