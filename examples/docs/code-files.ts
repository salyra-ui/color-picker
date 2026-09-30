import type { Integration } from './snippets';

export function sourceFiles(
  source: string,
  integration: Integration,
  baseName = 'Picker',
): { name: string; code: string }[] {
  if (integration === 'Vanilla') {
    // Register custom elements after their declarative children have been parsed.
    const scripts = [...source.matchAll(/<script src="[^"]+"><\/script>\n?/g)].map(match => match[0]).join('');
    source = source.replace(/<script src="[^"]+"><\/script>\n?/g, '');
    source = source.replace('<script>', `${scripts}<script>`);
  }
  source = readableSource(source);
  const name = {
    React: 'Picker.tsx',
    Svelte: 'Picker.svelte',
    Vue: 'Picker.vue',
    Angular: 'picker.component.ts',
    Astro: 'Picker.astro',
    Vanilla: 'index.html',
  }[integration]
    .replace('Picker', baseName)
    .replace(
      'picker',
      baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    );
  if (integration === 'React' || integration === 'Angular') {
    const marker =
      /\/\* (?:Add to your stylesheet:|In your global stylesheet:|Global stylesheet:?) \*\//;
    const match = source.match(marker);
    if (match?.index !== undefined)
      return [
        { name, code: source.slice(0, match.index).trim() },
        {
          name: 'styles.css',
          code: source.slice(match.index + match[0].length).trim(),
        },
      ];
  }
  return [{ name, code: source }];
}

function readableSource(source: string) {
  return source
    .replace(
      /([ \t]*)import \{ ([^}\n]{70,}) \} from/g,
      (_, indent, names) =>
        `${indent}import {\n${String(names)
          .split(', ')
          .map((name) => `${indent}  ${name},`)
          .join('\n')}\n${indent}} from`,
    )
    .replaceAll('/><Color', '/>\n    <Color')
    .replaceAll('/><Theme', '/>\n    <Theme');
}
