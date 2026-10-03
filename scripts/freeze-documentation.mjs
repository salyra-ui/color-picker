import {
  mkdtemp,
  mkdir,
  readdir,
  symlink,
  rm,
  cp,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const args = process.argv.slice(2);
const option = (name) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const version = option('--version');
if (!/^\d+\.\d+\.\d+$/.test(version ?? ''))
  throw Error('Pass --version with an exact release version');
const catalog = JSON.parse(
  await readFile('documentation/releases.json', 'utf8'),
);
const release = catalog.versions.find((item) => item.version === version);
if (!release?.sources)
  throw Error(
    'Release needs immutable source commits in documentation/releases.json',
  );
const output = resolve('documentation/archives', version);
try {
  await readFile(join(output, 'snapshot.json'));
  throw Error(
    'An archived release already exists. Do not overwrite released documentation.',
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const workspace = await mkdtemp(join(tmpdir(), `salyra-docs-${version}-`));
try {
  const colorRepo =
    option('--color-repo') || join(homedir(), 'Documents/color-picker');
  const themeRepo =
    option('--theme-repo') || join(homedir(), 'Documents/theme-kit-github');
  const extract = (repo, ref, paths = []) =>
    execFileSync('tar', ['-x', '-C', workspace], {
      input: execFileSync('git', ['archive', ref, ...paths], {
        cwd: repo,
        maxBuffer: 32 * 1024 * 1024,
      }),
    });
  extract(colorRepo, release.sources['color-picker']);
  extract(themeRepo, release.sources['theme-studio'], [
    'packages/theme-studio',
  ]);
  for (const kit of ['color-picker', 'theme-studio']) {
    const manifest = JSON.parse(
      await readFile(join(workspace, 'packages', kit, 'package.json'), 'utf8'),
    );
    if (manifest.version !== version)
      throw Error(`${kit} source is ${manifest.version}, expected ${version}`);
  }
  // Only installation guidance changes. Runtime and API examples stay at the release commits.
  const docs = join(workspace, 'examples/docs/main.ts');
  const docsSource = await readFile(docs, 'utf8');
  const install =
    /npm install @salyra-ui\/\$\{kit\}(?:@\$\{releases.current\})?/g;
  if (!install.test(docsSource))
    throw Error('Archive install command could not be pinned');
  await writeFile(
    docs,
    docsSource.replaceAll(
      install,
      () => 'npm install @salyra-ui/${kit}@' + version,
    ),
  );
  const dependencies = resolve('node_modules');
  await mkdir(join(workspace, 'node_modules/@salyra-ui'), { recursive: true });
  for (const name of await readdir(dependencies)) {
    if (name !== '@salyra-ui')
      await symlink(
        join(dependencies, name),
        join(workspace, 'node_modules', name),
      );
  }
  for (const kit of ['color-picker', 'theme-studio'])
    await symlink(
      join(workspace, 'packages', kit),
      join(workspace, 'node_modules/@salyra-ui', kit),
    );
  const log = execFileSync('npm', ['run', 'build:site'], {
    cwd: workspace,
    env: {
      ...process.env,
      PAGES_BASE: `/__SALYRA_SITE_BASE__/versions/${version}/`,
      SALYRA_FREEZE_DOCUMENTATION: '1',
    },
    maxBuffer: 16 * 1024 * 1024,
  });
  process.stdout.write(log);
  await cp(join(workspace, 'dist'), output, { recursive: true });
  const hashes = {};
  const walk = async (folder, prefix = '') => {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name),
        relative = prefix + entry.name;
      if (entry.isDirectory()) await walk(path, relative + '/');
      else
        hashes[relative] = createHash('sha256')
          .update(await readFile(path))
          .digest('hex');
    }
  };
  await walk(output);
  await writeFile(
    join(output, 'snapshot.json'),
    JSON.stringify(
      { version, sources: release.sources, files: hashes },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `Frozen ${version}: ${Object.keys(hashes).length} files from the release commits.`,
  );
} finally {
  await rm(workspace, { recursive: true, force: true });
}
