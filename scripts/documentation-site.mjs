import { mkdir, cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { build as bundle } from 'esbuild';
import { execFileSync } from 'node:child_process';
export async function publishDocumentationVersions(base, currentVersion) {
  const catalog = JSON.parse(
    await readFile('documentation/releases.json', 'utf8'),
  );
  if (catalog.current !== currentVersion)
    throw Error('Documentation current version must match package.json');
  const rootBase = base.endsWith('/') ? base : base + '/';
  await bundle({
    entryPoints: ['examples/docs/version-navigation.ts'],
    outfile: 'dist/docs-version-navigation.js',
    bundle: true,
    format: 'esm',
    minify: true,
    target: 'es2022',
    sourcemap: false,
  });
  await cp(
    'examples/docs/version-navigation.css',
    'dist/docs-version-navigation.css',
  );
  await writeFile(
    'dist/docs-versions.json',
    JSON.stringify(catalog, null, 2) + '\n',
  );
  const inject = async (folder, version) => {
    for (const name of await readdir(folder)) {
      if (!name.endsWith('.html')) continue;
      const path = join(folder, name);
      let html = await readFile(path, 'utf8');
      html = html.replace(
        /<body\b/,
        `<body data-docs-version="${version}" data-site-root="${rootBase}"`,
      );
      html = html.replace(
        '</head>',
        `<link rel="stylesheet" href="${rootBase}docs-version-navigation.css"></head>`,
      );
      html = html.replace(
        '</body>',
        `<script type="module" src="${rootBase}docs-version-navigation.js"></script></body>`,
      );
      await writeFile(path, html);
    }
  };
  await inject('dist', currentVersion);
  const replaceBase = async (folder) => {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) await replaceBase(path);
      else if (/\.(html|js|css|json)$/.test(entry.name)) {
        const text = await readFile(path, 'utf8');
        await writeFile(
          path,
          text.replaceAll('/__SALYRA_SITE_BASE__/', rootBase),
        );
      }
    }
  };
  for (const release of catalog.versions.filter(
    (item) => item.status === 'released',
  )) {
    const source = join('documentation/archives', release.version),
      target = join('dist/versions', release.version);
    const snapshot = JSON.parse(
      await readFile(join(source, 'snapshot.json'), 'utf8'),
    );
    if (snapshot.version !== release.version)
      throw Error('Archived documentation version mismatch');
    await cp(source, target, { recursive: true });
    await replaceBase(target);
    await inject(target, release.version);
  }
  // Released permalinks always use the archived build, including the current release.
  if (
    catalog.versions.find((item) => item.version === currentVersion)?.status ===
    'released'
  )
    return;
  const target = resolve('dist/versions', currentVersion),
    versionBase = rootBase + `versions/${currentVersion}/`;
  execFileSync(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      'build',
      '--base',
      versionBase,
      '--outDir',
      target,
    ],
    { stdio: 'inherit', env: process.env },
  );
  await cp(join(target, 'index.html'), join(target, 'react.html'));
  await cp(join(target, 'site.html'), join(target, 'index.html'));
  await cp('dist/downloads', join(target, 'downloads'), { recursive: true });
  for (const file of [
    'react.html',
    'svelte.html',
    'vue.html',
    'angular.html',
  ]) {
    const path = join(target, file);
    const html = await readFile(path, 'utf8');
    await writeFile(
      path,
      html
        .replace('href="/"', `href="${versionBase}react.html"`)
        .replace(
          /href="\/(svelte|vue|angular)\.html"/g,
          `href="${versionBase}$1.html"`,
        ),
    );
  }
  execFileSync(
    process.execPath,
    ['node_modules/astro/astro.js', 'build', '--root', 'examples/astro'],
    { stdio: 'inherit', env: { ...process.env, PAGES_BASE: versionBase } },
  );
  await cp('examples/astro/dist', join(target, 'demos/astro'), {
    recursive: true,
  });
  await inject(target, currentVersion);
  console.log(
    `Documentation versions: ${catalog.versions.map((item) => item.version).join(', ')}`,
  );
}
