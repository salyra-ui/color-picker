import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const catalog = JSON.parse(
  await readFile('documentation/releases.json', 'utf8'),
);
for (const release of catalog.versions.filter(
  (item) => item.status === 'released',
)) {
  const root = join('documentation/archives', release.version);
  const snapshot = JSON.parse(
    await readFile(join(root, 'snapshot.json'), 'utf8'),
  );
  if (
    snapshot.version !== release.version ||
    JSON.stringify(snapshot.sources) !== JSON.stringify(release.sources)
  )
    throw Error('Documentation release metadata changed');
  for (const [file, expected] of Object.entries(snapshot.files)) {
    const hash = createHash('sha256')
      .update(await readFile(join(root, file)))
      .digest('hex');
    if (hash !== expected)
      throw Error(
        `Archived documentation was changed: ${release.version}/${file}`,
      );
  }
  console.log(
    `Verified immutable documentation ${release.version}: ${Object.keys(snapshot.files).length} files.`,
  );
}
