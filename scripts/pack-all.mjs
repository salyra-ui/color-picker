import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
await mkdir('artifacts/scoped', { recursive: true });
const results = [];
for (const name of (await readdir('release')).sort()) {
 const packed = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', resolve('artifacts/scoped')], { cwd: `release/${name}`, encoding: 'utf8' }));
 for (const archive of packed) {
  for (const file of archive.files) {
   if (/\.map$/i.test(file.path)) throw new Error(`Sourcemap in npm archive: ${archive.name}/${file.path}`);
   if (/\.(js|ts|css|vue|svelte|astro)$/.test(file.path)) {
    const contents = await readFile(`release/${name}/${file.path}`, 'utf8');
    if (/sourceMappingURL\s*=/.test(contents)) throw new Error(`Sourcemap reference in npm archive: ${archive.name}/${file.path}`);
   }
  }
 }
 results.push(...packed);
}
await writeFile('artifacts/scoped/manifest.json', JSON.stringify(results, null, 2)+'\n');
console.log(`Packed ${results.length} scoped packages (no sourcemaps, not published).`);
