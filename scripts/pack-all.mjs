import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
await mkdir('artifacts/scoped', { recursive: true });
const results = [];
for (const name of (await readdir('release')).sort()) {
 const packed = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', resolve('artifacts/scoped')], { cwd: `release/${name}`, encoding: 'utf8' }));
 results.push(...packed);
}
await writeFile('artifacts/scoped/manifest.json', JSON.stringify(results, null, 2)+'\n');
console.log(`Packed ${results.length} scoped packages (not published).`);
