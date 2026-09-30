import type { Integration } from './snippets';

export function sourceFiles(
  source: string,
  integration: Integration,
): { name: string; code: string }[] {
  const name = {
    React: 'Picker.tsx',
    Svelte: 'Picker.svelte',
    Vue: 'Picker.vue',
    Angular: 'picker.component.ts',
    Astro: 'Picker.astro',
    Vanilla: 'index.html',
    PHP: 'example.php',
    htmx: 'fragment.html',
  }[integration];
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
