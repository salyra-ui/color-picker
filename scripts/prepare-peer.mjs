import { cp, readFile, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Shared integration examples validate against the matching peer branch.
// Set SALYRA_PEER_REF when the peer change lives on a different branch.
const manifest = JSON.parse(await readFile('package.json', 'utf8'));
const own = manifest.name.replace(/^salyra-ui-/, '').replace(/-workspace$/, '');
if (!['color-picker', 'theme-studio'].includes(own)) {
  console.log('Both packages are already available in this workspace.');
} else {
  const peer = own === 'color-picker' ? 'theme-studio' : 'color-picker';
  const branch =
    process.env.SALYRA_PEER_REF ||
    process.env.GITHUB_HEAD_REF ||
    execFileSync('git', ['branch', '--show-current'], {
      encoding: 'utf8',
    }).trim();
  if (!branch)
    throw new Error('Set SALYRA_PEER_REF when using a detached checkout.');
  const checkout = resolve('.peer', peer);
  await mkdir('.peer', { recursive: true });
  if (!existsSync(checkout)) {
    execFileSync(
      'git',
      [
        'clone',
        '--depth',
        '1',
        '--branch',
        branch,
        `https://github.com/salyra-ui/${peer}.git`,
        checkout,
      ],
      { stdio: 'inherit' },
    );
  } else {
    execFileSync(
      'git',
      ['-C', checkout, 'fetch', '--depth', '1', 'origin', branch],
      { stdio: 'inherit' },
    );
    execFileSync(
      'git',
      ['-C', checkout, 'checkout', '--detach', 'FETCH_HEAD'],
      { stdio: 'inherit' },
    );
  }
  const source = resolve(checkout, 'packages', peer);
  const peerManifest = JSON.parse(
    await readFile(resolve(source, 'package.json'), 'utf8'),
  );
  if (peerManifest.version !== manifest.version) {
    throw new Error(
      `Peer branch ${branch} has ${peerManifest.version}, expected ${manifest.version}.`,
    );
  }
  // Only this ignored peer directory is replaced. The repository's own source stays untouched.
  const target = resolve('packages', peer);
  if (
    execFileSync('git', ['ls-files', `packages/${peer}`], {
      encoding: 'utf8',
    }).trim()
  ) {
    throw new Error(`Refusing to replace tracked source in packages/${peer}.`);
  }
  await rm(target, { recursive: true, force: true });
  await cp(source, target, {
    recursive: true,
    filter: (path) =>
      !['dist', 'node_modules'].some((part) => path.split('/').includes(part)),
  });
  console.log(
    `Prepared ${peer}@${peerManifest.version} from ${branch}. Run npm ci next.`,
  );
}
