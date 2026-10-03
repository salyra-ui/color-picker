import type { Integration } from './snippets';

/** Public component names vary intentionally between component and native directive adapters. */
export function exportAdapters(name: string): Integration[] {
  const all: Integration[] = ['React', 'Svelte', 'Vue', 'Angular', 'Astro'];
  if (/^use(Color|Theme)/.test(name))
    return all.filter((adapter) => adapter !== 'Astro');
  if (/^provide/.test(name)) return ['Svelte', 'Vue'];
  if (/^watch/.test(name)) return ['Vue'];
  if (name.endsWith('Context') || name.endsWith('Primitives'))
    return ['Angular'];
  if (['ColorPicker', 'ThemeStudio', 'ColorMarkerThumb'].includes(name))
    return ['React', 'Svelte', 'Vue'];
  if (
    ['ColorWheelSurface', 'ThemePickerWheel', 'ColorFormatTrigger'].includes(
      name,
    )
  )
    return all.filter(
      (adapter) => adapter !== 'Angular' || name === 'ColorFormatTrigger',
    );
  if (['ThemeWheel'].includes(name))
    return all.filter((adapter) => adapter !== 'Astro');
  if (name === 'ThemeColor')
    return all.filter((adapter) => adapter !== 'Angular');
  return all;
}
