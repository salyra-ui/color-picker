import { recipeSource } from './recipes';
import {
  themePickerMarkup,
  themePaletteMarkup,
  generateTheme,
  type TokenSelection,
  type Target,
} from '@salyra-ui/theme-studio/vanilla';
export const integrations = [
  'React',
  'Svelte',
  'Vue',
  'Angular',
  'Astro',
  'Vanilla',
] as const;
export type Integration = (typeof integrations)[number];
export type Kit = 'color-picker' | 'theme-studio';
export type ColorVariant =
  'rectangle' | 'wheel' | 'channels' | 'custom' | 'disabled' | 'form';
export type ThemeVariant =
  | 'editing'
  | 'shared'
  | 'rectangle'
  | 'single'
  | 'geometry'
  | 'presets'
  | 'custom'
  | 'palette'
  | 'disabled';
export const colorVariants: {
  id: ColorVariant;
  title: string;
  description: string;
}[] = [
  {
    id: 'rectangle',
    title: 'Rectangle',
    description:
      'Drag to adjust saturation and brightness. The sliders below change hue and opacity.',
  },
  {
    id: 'wheel',
    title: 'Wheel',
    description:
      'Pick a hue around the wheel, then move inward to reduce saturation. Adjust brightness and opacity with the sliders.',
  },
  {
    id: 'channels',
    title: 'Channel inputs',
    description:
      'Enter each channel separately. Change the format to switch between HEX, RGB, HSL, HSV, OKLCH and OKLab.',
  },
  {
    id: 'custom',
    title: 'Custom controls',
    description:
      'Change the label inside the dot, the control color and the track size. Copy the updated component and styles.',
  },
];
colorVariants.push({id:'form', title:'Forms & saved colors', description:'Submit the selected color, reset the form, undo edits and keep recent or favorite swatches.'});
colorVariants.push({
  id: 'disabled',
  title: 'Disabled',
  description:
    'A disabled picker keeps its color visible and blocks editing. You can still update it from the store.',
});
export const themeVariants: {
  id: ThemeVariant;
  title: string;
  description: string;
}[] = [
  {
    id: 'shared',
    title: 'Shared wheel',
    description:
      'Select a marker to edit primary, secondary or accent. Brightness and the channel fields follow the selected color.',
  },
  {
    id: 'rectangle',
    title: 'Separate role editing',
    description:
      'Choose a color role above the rectangle. Editing it keeps the other two colors unchanged.',
  },
  {
    id: 'single',
    title: 'Primary only',
    description:
      'Edit primary with a single dot. The JSON and CSS contain only the primary palette.',
  },
  {
    id: 'geometry',
    title: 'Radius & borders',
    description:
      'Choose which radius and border width fields to include. Only the enabled fields appear in the editor and its export.',
  },
  {
    id: 'presets',
    title: 'Presets & appearance',
    description:
      'Choose a saved theme and an appearance setting. The appearance setting is remembered after a refresh.',
  },
  {
    id: 'custom',
    title: 'Custom generator',
    description:
      'Give the editor your own labels, colors and classes. The appearance buttons show how to replace the default text.',
  },
];
themeVariants.push({id:'editing', title:'Draft & Apply', description:'Edit a draft, undo changes, lock accent during generation and apply the result to a separate preview.'});
themeVariants.push(
  {
    id: 'palette',
    title: 'Shade swatches',
    description:
      'Show the generated shades as squares, circles or a joined strip. Change the labels and classes without replacing the theme colors.',
  },
  {
    id: 'disabled',
    title: 'Disabled',
    description:
      'Disable the editor while keeping its values and generated shades visible. Programmatic theme updates still work.',
  },
);
export function packageFor(kit: Kit, integration: Integration) {
  return `@salyra-ui/${kit}/${integration.toLowerCase()}`;
}
function stylesheetFor(pkg: string) {
  return `${pkg.split('/').slice(0, 2).join('/')}/styles.min.css`;
}
const customCss = `.custom-picker {\n  --cp-thumb-size: 22px;\n  --cp-thumb-radius: 0;\n  --cp-track-height: 12px;\n  --cp-track-radius: 0;\n}\n.custom-picker [data-cp-part="thumb-text"] { font-size: 10px; }`;
function baseColorExample(
  integration: Integration,
  variant: ColorVariant,
): string {
  const pkg = packageFor('color-picker', integration);
  const surface = variant === 'wheel' ? 'ColorWheel' : 'ColorArea';
  const parts = [
    ...(variant === 'channels' ? [] : [surface]),
    ...(variant === 'rectangle' || variant === 'custom'
      ? ['ColorSlider']
      : ['ColorSlider']),
    'ColorFormatSelect',
    'ColorInput',
    'ColorAlphaInput',
    'ColorMode',
  ];
  const custom = variant === 'custom';
  const props = custom
    ? " thumbText=\"C\" classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}"
    : '';
  const children = `${variant === 'channels' ? '' : `<${surface}${props} />\n    `}<ColorSlider channel="${variant === 'wheel' ? 'v' : variant === 'channels' ? 'alpha' : 'h'}" />${variant === 'channels' ? '' : '\n    <ColorSlider channel="alpha" />'}\n    <ColorFormatSelect /><ColorInput /><ColorAlphaInput /><ColorMode />`;
  const format = variant === 'channels' ? 'rgb' : 'hex';
  const imports = `ColorProvider, ${[...new Set(parts)].join(', ')}, createColorStore`;
  const cssImport = `import '${stylesheetFor(pkg)}';`;
  if (integration === 'React')
    return `import { useState } from 'react';\nimport { ${imports} } from '${pkg}';\n${cssImport}\n\nexport function Picker() {\n  const [store] = useState(() => createColorStore('#5268E080', '${format}'));\n  return <div${custom ? ' className="picker-parts custom-picker"' : ' className="picker-parts"'}>\n    <ColorProvider store={store} onChange={() => {\n      const color = store.getColor();\n      console.log(color.name, color.hex, color.hsl, color.formats);\n    }}>\n    ${children}\n    </ColorProvider>\n  </div>;\n}${custom ? '\n\n/* Add to your stylesheet: */\n' + customCss : ''}`;
  if (integration === 'Svelte')
    return `<script lang="ts">\n  import { ${imports} } from '${pkg}';\n  ${cssImport}\n  const store = createColorStore('#5268E080', '${format}');\n</script>\n\n<div${custom ? ' class="picker-parts custom-picker"' : ' class="picker-parts"'}>\n  <ColorProvider {store} onChange={() => console.log(store.getColor())}>\n    ${children}\n  </ColorProvider>\n</div>${custom ? '\n<style>\n' + customCss.replace('[data-cp-part="thumb-text"]', ':global([data-cp-part="thumb-text"])') + '\n</style>' : ''}`;
  if (integration === 'Vue')
    return `<script setup lang="ts">\nimport { ${imports} } from '${pkg}';\n${cssImport}\nconst store = createColorStore('#5268E080', '${format}');\n</script>\n\n<template>\n  <div${custom ? ' class="picker-parts custom-picker"' : ' class="picker-parts"'}>\n  <ColorProvider :store="store" @change="console.log(store.getColor())">\n    ${children.replace("classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}", ":classes=\"{ root: 'brand-surface', thumb: 'brand-thumb' }\"")}\n  </ColorProvider>\n  </div>\n</template>${custom ? '\n<style>\n' + customCss + '\n</style>' : ''}`;
  const angularChildren = children
    .replace(
      "classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}",
      "[classes]=\"{ root: 'brand-surface', thumb: 'brand-thumb' }\"",
    )
    .replace(/ColorArea/g, 'cp-area')
    .replace(/ColorWheel/g, 'cp-wheel')
    .replace(/ColorSlider/g, 'cp-slider')
    .replace(/ColorFormatSelect/g, 'cp-format-select')
    .replace(/ColorInput/g, 'cp-input')
    .replace(/ColorAlphaInput/g, 'cp-alpha-input')
    .replace(/ColorMode/g, 'cp-mode');
  if (integration === 'Angular')
    return `import { Component } from '@angular/core';\nimport { ${imports} } from '${pkg}';\n\n@Component({\n  selector: 'app-color-picker', standalone: true,\n  imports: [ColorProvider, ${[...new Set(parts)].join(', ')}],\n  template: \`<div${custom ? ' class="picker-parts custom-picker"' : ' class="picker-parts"'}>\n  <cp-provider [store]="store" (colorChange)="changed()">\n    ${angularChildren}\n  </cp-provider></div>\`,\n})\nexport class Picker {\n  readonly store = createColorStore('#5268E080', '${format}');\n  changed() { console.log(this.store.getColor()); }\n}\n\n/* In your global stylesheet: */\n@import '${stylesheetFor(pkg)}';${custom ? '\n' + customCss : ''}`;
  if (integration === 'Astro') {
    const components = ['ColorProvider', ...new Set(parts)];
    const astroChildren = children
      .replace(
        /<(ColorArea|ColorWheel|ColorInput|ColorAlphaInput)(?=[ />])/g,
        '<$1 {value}',
      )
      .replace(
        '<ColorSlider channel="h"',
        '<ColorSlider value={state.h} channel="h"',
      )
      .replace(
        '<ColorSlider channel="v"',
        '<ColorSlider value={state.v} channel="v"',
      )
      .replaceAll(
        '<ColorSlider channel="alpha"',
        '<ColorSlider value={state.alpha * 100} channel="alpha"',
      );
    return `---\nimport { createColorStore } from '${pkg}';\n${components.map((c) => `import ${c} from '${pkg}/${c}.astro';`).join('\n')}\n${cssImport}\nconst value = '#5268E080';\nconst state = createColorStore(value).getSnapshot();\n---\n<div${custom ? ' class="picker-parts custom-picker"' : ' class="picker-parts"'}>\n  <ColorProvider {value}>\n    ${astroChildren}\n  </ColorProvider>\n</div>\n<script>\n  import type { ColorProviderElement } from '${pkg}/client';\n  document.querySelector('cp-provider')?.addEventListener('color-change', event => {\n    console.log((event.currentTarget as ColorProviderElement).store?.getColor());\n  });\n</script>${custom ? '\n<style is:global>\n' + customCss + '\n</style>' : ''}`;
  }
  const markup = colorMarkup(variant);
  return `<link rel="stylesheet" href="/assets/color-picker.min.css">
<script src="/assets/color-picker.min.js"></script>
${markup}
<script>
const store = ColorPicker.createColorStore('#5268E080', '${format}');
const provider = document.querySelector('cp-provider');
provider.setStore(store);
provider.addEventListener('color-change', () => console.log(store.getColor()));
</script>${custom ? '\n<style>\n' + customCss + '\n</style>' : ''}`;
}
export function colorMarkup(variant: ColorVariant) {
  const surface =
    variant === 'channels'
      ? ''
      : variant === 'wheel'
        ? `<cp-wheel><div class="cp-wheel" data-area data-cp-part="surface" tabindex="0" role="group" aria-label="Hue and saturation wheel"><span data-cp-part="thumb"></span></div></cp-wheel>`
        : `<cp-area><div class="cp-area" data-area data-cp-part="surface" tabindex="0" role="group" aria-label="Saturation and brightness"><span data-cp-part="thumb">${variant === 'custom' ? '<span data-cp-part="thumb-text">C</span>' : ''}</span></div></cp-area>`;
  const slider = (channel: string, label: string) =>
    `<cp-slider channel="${channel}"><label class="cp-slider" data-channel="${channel}">${label}<input type="range" min="0" max="${channel === 'h' ? '359' : '100'}"></label></cp-slider>`;
  return `<cp-provider value="#5268E080" class="picker-parts${variant === 'custom' ? ' custom-picker' : ''}">\n  ${surface}${surface ? '\n  ' + slider(variant === 'wheel' ? 'v' : 'h', variant === 'wheel' ? 'Brightness' : 'Hue') : ''}\n  ${slider('alpha', 'Alpha')}\n  <cp-format-select><label class="cp-format">Format<select>${['hex', 'rgb', 'hsl', 'hsv', 'oklch', 'oklab'].map((f) => `<option value="${f}">${f.toUpperCase()}</option>`).join('')}</select></label></cp-format-select>\n  <cp-input></cp-input>\n  <cp-alpha-input><label class="cp-channel cp-alpha-input">Alpha<span class="cp-channel-field"><input type="number" min="0" max="100" step=".1"><span aria-hidden="true">%</span></span></label></cp-alpha-input>\n  ${variant === 'custom' ? '<cp-mode data-custom><button type="button"><span>Change <span data-color-format>HEX</span> format</span></button></cp-mode>' : '<cp-mode><button type="button">Switch format</button></cp-mode>'}\n  <cp-output format="json"><output hidden></output></cp-output>\n</cp-provider>`;
}
function baseThemeExample(
  integration: Integration,
  variant: ThemeVariant,
  selection: TokenSelection,
): string {
  if (variant === 'custom') return customThemeExample(integration);
  const pkg = packageFor('theme-studio', integration),
    view = variant === 'rectangle' || variant === 'geometry' ? 'area' : 'wheel';
  let components =
    variant === 'presets'
      ? ['ThemeSelect', 'ThemeMode']
      : [
          'ThemeName',
          'ThemeSelect',
          'ThemePicker',
          'ThemeHarmony',
          'ThemeBackground',
          'ThemeRadius',
          'ThemeBorderWidth',
          'ThemeMode',
          'ThemeExport',
          'ThemePalette',
        ];
  const modes = ['system', 'light', 'dark']
    .map(
      (mode) =>
        `<ThemeMode value="${mode}">${mode[0].toUpperCase() + mode.slice(1)}</ThemeMode>`,
    )
    .join('\n    ');
  const fixedPicker = `<ThemePicker view="${variant === 'shared' ? 'shared-wheel' : view}" roles={${JSON.stringify(selection.roles ?? ['primary']).replaceAll('\"', "'")}} controls={false} />`;
  const geometry = [
    ...(selection.radius ?? []).map(
      (target) => `<ThemeRadius target="${target}" />`,
    ),
    ...(selection.width ?? []).map(
      (target) => `<ThemeBorderWidth target="${target}" />`,
    ),
  ].join('\n    ');
  const exportPart = '<ThemeExport selection={selection} />';
  const parts =
    variant === 'presets'
      ? `<ThemeSelect themes={themes} />\n    ${modes}\n    ${['primary', 'secondary', 'accent'].map((role) => `<ThemePalette role="${role}" shape="joined" />`).join('\n    ')}`
      : `<ThemeName />\n    ${variant === 'shared' || variant === 'rectangle' || variant === 'disabled' ? '<ThemeSelect themes={themes} />' : ''}\n    ${fixedPicker}\n    ${variant === 'shared' || variant === 'rectangle' ? '<ThemeHarmony />' : ''}\n    ${selection.background ? '<ThemeBackground />' : ''}\n    ${geometry}\n    ${variant === 'single' || selection.modes?.length === 1 ? '' : modes}\n    ${(selection.roles ?? ['primary']).map((role) => `<ThemePalette role="${role}" shape="joined" />`).join('\n    ')}\n    ${exportPart}`;
  components = [
    ...new Set(
      (parts.match(/<Theme[A-Z]\w+/g) ?? []).map((tag) => tag.slice(1)),
    ),
  ];
  const helpers = 'generateTheme, browserModeStorage';
  const css = `import '${stylesheetFor(pkg)}';`;
  const setup = `const selection = ${JSON.stringify(selection)} as const;\nconst themes = [generateTheme('#5268E0', { name: 'Indigo' }), generateTheme('#277D59', { name: 'Forest' }), generateTheme('#C25D3D', { name: 'Terracotta' })];`;
  if (integration === 'React')
    return `import { ThemeProvider, ${components.join(', ')}, ${helpers} } from '${pkg}';\n${css}\n\n${setup}\nexport function ThemeExample() {\n  return <ThemeProvider theme={themes[0]} selection={selection} mode="system"\n    modeStorage={browserModeStorage('app:mode')}>\n    ${parts}\n    <section className="app-preview">Your application content</section>\n  </ThemeProvider>;\n}\n/* .app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); } */`;
  if (integration === 'Svelte')
    return `<script lang="ts">\n  import { ThemeProvider, ${components.join(', ')}, ${helpers} } from '${pkg}';\n  ${css}\n  ${setup}\n</script>\n\n<ThemeProvider options={{ theme: themes[0], selection, mode: 'system',\n  modeStorage: browserModeStorage('app:mode') }}>\n    ${parts.replace('themes={themes}', '{themes}').replace(/<ThemeMode value="(system|light|dark)">([^<]+)<\/ThemeMode>/g, '<ThemeMode value="$1">{#snippet children()}$2{/snippet}</ThemeMode>')}\n    <section class="app-preview">Your application content</section>\n</ThemeProvider>\n<style>\n  .app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }\n</style>`;
  if (integration === 'Vue')
    return `<script setup lang="ts">\nimport { ThemeProvider, ${components.join(', ')}, ${helpers} } from '${pkg}';\n${css}\n${setup}\n</script>\n<template>\n  <ThemeProvider :options="{ theme: themes[0], selection, mode: 'system',\n    modeStorage: browserModeStorage('app:mode') }">\n    ${parts
      .replace('themes={themes}', ':themes="themes"')
      .replace(/roles=\{([^}]+)\}/g, ':roles="$1"')
      .replace('controls={false}', ':controls="false"')
      .replace('selection={selection}', ':selection="selection"')
      .replace("roles={['primary']}", ':roles="[\'primary\']"')
      .replace(
        "selection={{ roles: ['primary'] }}",
        ':selection="{ roles: [\'primary\'] }"',
      )}\n    <section class="app-preview">Your application content</section>\n  </ThemeProvider>\n</template>\n<style>\n.app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }\n</style>`;
  const tags: Record<string, string> = {
    ThemeName: 'tk-name',
    ThemePicker: 'tk-picker',
    ThemeHarmony: 'tk-harmony',
    ThemeBackground: 'tk-background',
    ThemeRadius: 'tk-radius',
    ThemeBorderWidth: 'tk-border-width',
    ThemeMode: 'tk-mode',
    ThemeExport: 'tk-export',
    ThemeSelect: 'tk-select',
    ThemePalette: 'tk-palette',
  };
  const angular = parts
    .replace(/Theme\w+/g, (v) => tags[v] ?? v)
    .replace('themes={themes}', '[themes]="themes"')
    .replace(/roles=\{([^}]+)\}/g, '[roles]="$1"')
    .replace('controls={false}', '[controls]="false"')
    .replace('selection={selection}', '[selection]="selection"')
    .replace("roles={['primary']}", '[roles]="[\'primary\']"')
    .replace(
      "selection={{ roles: ['primary'] }}",
      '[selection]="{ roles: [\'primary\'] }"',
    );
  if (integration === 'Angular')
    return `import { Component } from '@angular/core';\nimport { ThemeProvider, ${components.join(', ')}, ${helpers} } from '${pkg}';\n\n@Component({ selector: 'app-theme', standalone: true,\n  imports: [ThemeProvider, ${components.join(', ')}],\n  template: \`<tk-provider [options]="options">\n    ${angular.replace(/<tk-mode value="(system|light|dark)">([^<]+)<\/tk-mode>/g, '<tk-mode value="$1"><ng-template>$2</ng-template></tk-mode>')}\n    <section class="app-preview">Your application content</section>\n  </tk-provider>\`,\n})\nexport class ThemeExample {\n  readonly selection = ${JSON.stringify(selection)} as const;\n  readonly themes = [generateTheme('#5268E0', { name: 'Indigo' }), generateTheme('#277D59', { name: 'Forest' }), generateTheme('#C25D3D', { name: 'Terracotta' })];\n  readonly options = { theme: this.themes[0], selection: this.selection, mode: 'system' as const,\n    modeStorage: browserModeStorage('app:mode') };\n}\n/* Global stylesheet: */\n@import '${stylesheetFor(pkg)}';\n.app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }`;
  if (integration === 'Astro')
    return `---\nimport { generateTheme } from '${pkg}';\n${['ThemeProvider', ...components].map((c) => `import ${c} from '${pkg}/${c}.astro';`).join('\n')}\n${css}\n${setup}\nconst theme = themes[0];\n---\n<ThemeProvider {theme} {selection} mode="system" modeStorageKey="app:mode">\n    ${parts
      .replace('<ThemeSelect ', '<ThemeSelect {theme} ')
      .replace('<ThemeName />', '<ThemeName {theme} />')
      .replace('<ThemePicker ', '<ThemePicker {theme} ')
      .replace('<ThemeHarmony />', '<ThemeHarmony {theme} />')
      .replace('<ThemeBackground />', '<ThemeBackground {theme} />')
      .replace('<ThemeRadius ', '<ThemeRadius {theme} ')
      .replace('<ThemeBorderWidth ', '<ThemeBorderWidth {theme} ')
      .replaceAll('<ThemePalette ', '<ThemePalette {theme} ')
      .replace(
        '<ThemeExport',
        `<ThemeExport {theme} mode="${selection.modes?.length === 1 ? selection.modes[0] : 'light'}"`,
      )}\n    <section class="app-preview">Your application content</section>\n</ThemeProvider>\n<style>.app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }</style>`;
  const markup = nativeThemeMarkup(variant, selection);
  const init = `const options = { theme: ThemeStudio.generateTheme('#5268E0', { name: 'Indigo' }), selection: ${JSON.stringify(selection)}, mode: 'system',
  modeStorage: ThemeStudio.browserModeStorage('app:mode') };
const provider = document.querySelector('tk-provider');
provider.setStore(ThemeStudio.createThemeStore(options), options);
const render = () => {
  const config = ThemeStudio.themeConfiguration(provider.store.getSnapshot());
  document.querySelector('#preview').style.cssText = config.css;
  console.log(config.theme.name, config.json);
};
provider.addEventListener('theme-change', render);
render();`;
  return `<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"></script>
${markup}
<section id="preview">Your application content</section>
<script>
${init}
</script>
<style>
#preview { background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 24px; }
</style>`;
}
function baseLoaderExample(integration: Integration) {
  const pkg = packageFor('theme-studio', integration);
  const options = `fallbackTheme: generateTheme('#5268E0'),\n  loadTheme: createHttpThemeLoader('/api/theme'),\n  timeoutMs: 10000, modeStorage: false as const`;
  if (integration === 'React')
    return `import { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,
  generateTheme, createHttpThemeLoader } from '${pkg}';

export function RemoteTheme() {
  return <ThemeProvider fallbackTheme={generateTheme('#5268E0')}
    loadTheme={createHttpThemeLoader('/api/theme')}
    timeoutMs={10000} modeStorage={false}>
    <ThemeLoading><div>Loading theme…</div></ThemeLoading>
    <ThemeReady><section>Your themed content</section></ThemeReady>
    <ThemeError>{(error, retry) =>
      <button onClick={() => void retry()}>Retry</button>
    }</ThemeError>
  </ThemeProvider>;
}`;
  if (integration === 'Svelte')
    return `<script lang="ts">\n  import { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,\n    generateTheme, createHttpThemeLoader } from '${pkg}';\n  const options = { ${options} };\n</script>\n<ThemeProvider {options}>\n  <ThemeLoading><div>Loading theme…</div></ThemeLoading>\n  <ThemeReady><section>Your themed content</section></ThemeReady>\n  <ThemeError>{#snippet children(error, retry)}\n    <button onclick={retry}>Retry</button>\n  {/snippet}</ThemeError>\n</ThemeProvider>`;
  if (integration === 'Vue')
    return `<script setup lang="ts">\nimport { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,\n  generateTheme, createHttpThemeLoader } from '${pkg}';\nconst options = { ${options} };\n</script>\n<template><ThemeProvider :options="options">\n  <ThemeLoading><div>Loading theme…</div></ThemeLoading>\n  <ThemeReady><section>Your themed content</section></ThemeReady>\n  <ThemeError v-slot="{ error, retry }"><button @click="retry">Retry</button></ThemeError>\n</ThemeProvider></template>`;
  if (integration === 'Astro')
    return `---\nimport { generateTheme } from '${pkg}';\n${['ThemeProvider', 'ThemeLoading', 'ThemeReady', 'ThemeError'].map((c) => `import ${c} from '${pkg}/${c}.astro';`).join('\n')}\nconst fallbackTheme = generateTheme('#5268E0');\n---\n<ThemeProvider {fallbackTheme} src="/api/theme" modeStorage={false}>\n  <ThemeLoading><div>Loading theme…</div></ThemeLoading>\n  <ThemeReady><section>Your themed content</section></ThemeReady>\n  <ThemeError><button data-tk-retry>Retry</button></ThemeError>\n</ThemeProvider>`;
  if (integration === 'Angular')
    return `import { Component } from '@angular/core';\nimport { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,\n  createThemeStore, generateTheme, createHttpThemeLoader } from '${pkg}';\n@Component({ selector: 'app-remote-theme', standalone: true,\n  imports: [ThemeProvider, ThemeLoading, ThemeReady, ThemeError],\n  template: \`<tk-provider [store]="store" [options]="options">\n    <tk-loading>Loading theme…</tk-loading>\n    <tk-ready>Your themed content</tk-ready>\n    <tk-error><button (click)="store.reload()">Retry</button></tk-error>\n  </tk-provider>\` })\nexport class RemoteTheme {\n  readonly options = { ${options} };\n  readonly store = createThemeStore(this.options);\n}`;
  const script = `const options = { ${options} };
const store = ThemeStudio.createThemeStore(options);
const render = () => {
  const state = store.getSnapshot();
  document.querySelector('#content').style.cssText = ThemeStudio.themeConfiguration(state).css;
  document.querySelector('#loading').hidden = state.status !== 'loading';
  document.querySelector('#content').hidden = state.status === 'loading';
  document.querySelector('#retry').hidden = !state.error;
};
const unsubscribe = store.subscribe(render);
render();
const unmount = ThemeStudio.mountThemeStore(store, undefined, options);
document.querySelector('#retry').addEventListener('click', () => store.reload());
// On removal: unsubscribe(); unmount();`
    .replace('false as const', 'false')
    .replace(
      'fallbackTheme: generateTheme(',
      'fallbackTheme: ThemeStudio.generateTheme(',
    )
    .replace(
      'loadTheme: createHttpThemeLoader(',
      'loadTheme: ThemeStudio.createHttpThemeLoader(',
    );
  return `<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"></script>
<div id="loading">Loading theme…</div>
<section id="content">Your themed content</section>
<button id="retry" hidden>Retry</button>
<script>
${script}
</script>
<style>#content { background: hsl(var(--background)); color: hsl(var(--foreground)); }</style>`;
}
export interface CustomSettings {
  text: string;
  color: string;
  size: number;
  track: number;
}
export const defaultCustom: CustomSettings = {
  text: 'C',
  color: '#E4002B',
  size: 22,
  track: 12,
};
export function customStyle(
  settings: CustomSettings,
  selector = '.custom-picker',
) {
  return `${selector} {\n  --cp-thumb-size: ${settings.size}px;\n  --cp-thumb-radius: 0;\n  --cp-track-height: ${settings.track}px;\n  --cp-track-radius: 0;\n  --cp-controls-color: ${settings.color};\n}\n${selector} [data-cp-part="thumb-text"] { font-size: 10px; color: white; }\n${selector} input[type="range"] { accent-color: var(--cp-controls-color); }\n${selector} button { border-color: var(--cp-controls-color); color: var(--cp-controls-color); }\n${selector} button[aria-pressed="true"] { background: var(--cp-controls-color); color: white; }`;
}
export function colorExample(
  integration: Integration,
  variant: ColorVariant,
  settings = defaultCustom,
) {
  if (variant === 'form') return recipeSource('color-picker', integration);
  let source = withColorLayout(
    baseColorExample(
      integration,
      variant === 'disabled' ? 'rectangle' : variant,
    ),
    integration,
  );
  if (variant === 'disabled') return disableExample(source, integration, false);
  if (variant !== 'custom') return source;
  if (integration === 'React')
    source = source.replace(
      '<ColorMode />',
      '<ColorMode>{format => <span>Change {format.toUpperCase()} format</span>}</ColorMode>',
    );
  if (integration === 'Svelte')
    source = source.replace(
      '<ColorMode />',
      '<ColorMode>{#snippet children(format)}<span>Change {format.toUpperCase()} format</span>{/snippet}</ColorMode>',
    );
  if (integration === 'Vue')
    source = source.replace(
      '<ColorMode />',
      '<ColorMode v-slot="{ format }"><span>Change {{ format.toUpperCase() }} format</span></ColorMode>',
    );
  if (integration === 'Angular')
    source = source.replace(
      '<cp-mode />',
      '<cp-mode><ng-template let-format><span>Change {{ format.toUpperCase() }} format</span></ng-template></cp-mode>',
    );
  if (integration === 'Astro')
    source = source.replace(
      '<ColorMode />',
      '<ColorMode><span>Change <span data-color-format>HEX</span> format</span></ColorMode>',
    );
  if (integration === 'Vanilla')
    source = source.replace(
      '<cp-mode><button type="button">Switch format</button></cp-mode>',
      '<cp-mode data-custom><button type="button"><span>Change <span data-color-format>HEX</span> format</span></button></cp-mode>',
    );
  const text = settings.text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return source
    .replaceAll('thumbText="C"', `thumbText="${text}"`)
    .replaceAll('>C</span>', `>${text}</span>`)
    .replace(customCss, customStyle(settings))
    .replace(
      customCss.replace(
        '[data-cp-part="thumb-text"]',
        ':global([data-cp-part="thumb-text"])',
      ),
      customStyle(settings)
        .replace(
          '[data-cp-part="thumb-text"]',
          ':global([data-cp-part="thumb-text"])',
        )
        .replace('input[type="range"]', ':global(input[type="range"])')
        .replace(' button', ' :global(button)'),
    );
}
export function customThemeMarkup() {
  return `<div class="custom-theme">\n  <h3 class="generator-title">Brand color</h3>\n  <label>Theme title<input data-tk-name maxlength="200"></label>\n  <cp-provider data-theme-generator data-role="primary" class="picker-parts">\n    <cp-area><div class="cp-area" data-area data-cp-part="surface" tabindex="0" role="group" aria-label="Brand color"><span data-cp-part="thumb"><span data-cp-part="thumb-text">B</span></span></div></cp-area>\n    <cp-slider channel="h"><label class="cp-slider" data-channel="h">Color tone<input type="range" min="0" max="359"></label></cp-slider>\n    <cp-input></cp-input>\n  </cp-provider>\n  <div class="custom-mode-bar">\n    <button type="button" data-tk-mode="system">Use device</button>\n    <button type="button" data-tk-mode="light">Day</button>\n    <button type="button" data-tk-mode="dark">Night</button>\n  </div>\n  ${themePaletteMarkup('primary', { shape: 'joined' })}\n</div>`;
}
function customThemeExample(i: Integration) {
  const pkg = packageFor('theme-studio', i),
    cp = packageFor('color-picker', i),
    css = `import '${stylesheetFor(pkg)}';`;
  const style = customStyle(
    { ...defaultCustom, text: 'B', size: 26 },
    '.custom-theme',
  );
  const body = `<ThemeName label="Theme title" />\n    <h3>Brand color</h3>\n    <ThemeGenerator role="primary">\n      <ColorArea thumbText="B" classes={{ root: 'brand-surface', thumb: 'brand-thumb' }} />\n      <ColorSlider channel="h" label="Color tone" /><ColorInput />\n    </ThemeGenerator>\n    <ThemeMode value="system">Use device</ThemeMode>\n    <ThemeMode value="light">Day</ThemeMode>\n    <ThemeMode value="dark">Night</ThemeMode>\n    <ThemePalette role="primary" shape="joined" />`;
  const imports = `ThemeProvider, ThemeGenerator, ThemeName, ThemeMode, ThemePalette, generateTheme`;
  const cpImports = `ColorArea, ColorSlider, ColorInput`;
  if (i === 'React')
    return `import { ${imports} } from '${pkg}';\nimport { ${cpImports} } from '${cp}';\n${css}\n\nexport function CustomGenerator() {\n  return <ThemeProvider theme={generateTheme('#5268E0')} modeStorage={false}>\n  <div className="custom-theme">\n    ${body}\n  </div>\n  </ThemeProvider>;\n}\n/* Global stylesheet */\n${style}`;
  if (i === 'Svelte')
    return `<script lang="ts">\n  import { ${imports} } from '${pkg}';\n  import { ${cpImports} } from '${cp}';\n  ${css}\n</script>\n<ThemeProvider options={{ theme: generateTheme('#5268E0'), modeStorage: false }}>\n  <div class="custom-theme">\n    ${body.replace(/<ThemeMode value="(system|light|dark)">([^<]+)<\/ThemeMode>/g, '<ThemeMode value="$1">{#snippet children()}$2{/snippet}</ThemeMode>')}\n  </div>\n</ThemeProvider>\n<!-- Add this CSS globally (or use :global for internal selectors). -->\n<style is:global>\n${style}\n</style>`.replace(
      '<style is:global>',
      '<style>',
    );
  if (i === 'Vue')
    return `<script setup lang="ts">\nimport { ${imports} } from '${pkg}';\nimport { ${cpImports} } from '${cp}';\n${css}\n</script>\n<template>\n<ThemeProvider :options="{ theme: generateTheme('#5268E0'), modeStorage: false }">\n  <div class="custom-theme">\n    ${body.replace("classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}", ":classes=\"{ root: 'brand-surface', thumb: 'brand-thumb' }\"")}\n  </div>\n</ThemeProvider>\n</template>\n<style>\n${style}\n</style>`;
  if (i === 'Angular')
    return `import { Component } from '@angular/core';\nimport { ${imports} } from '${pkg}';\nimport { ${cpImports} } from '${cp}';\n@Component({ selector: 'app-custom-theme', standalone: true,\n  imports: [ThemeProvider, ThemeGenerator, ThemeName, ThemeMode, ThemePalette, ${cpImports}],\n  template: \`<tk-provider [options]="options"><div class="custom-theme">\n    <tk-name label="Theme title" /><h3>Brand color</h3>\n    <tk-generator role="primary" [custom]="true">\n      <cp-area thumbText="B" [classes]="{ root: 'brand-surface', thumb: 'brand-thumb' }" />\n      <cp-slider channel="h" label="Color tone" /><cp-input />\n    </tk-generator>\n    <tk-mode value="system"><ng-template>Use device</ng-template></tk-mode>\n    <tk-mode value="light"><ng-template>Day</ng-template></tk-mode>\n    <tk-mode value="dark"><ng-template>Night</ng-template></tk-mode>\n    <tk-palette role="primary" shape="joined" />\n  </div></tk-provider>\` })\nexport class CustomGenerator {\n readonly options = {theme: generateTheme('#5268E0'), modeStorage: false as const};\n}\n/* Global stylesheet */\n@import '${stylesheetFor(pkg)}';\n${style}`;
  if (i === 'Astro')
    return `---\nimport { generateTheme } from '${pkg}';\n${['ThemeProvider', 'ThemeGenerator', 'ThemeName', 'ThemeMode', 'ThemePalette'].map((c) => `import ${c} from '${pkg}/${c}.astro';`).join('\n')}\n${['ColorArea', 'ColorSlider', 'ColorInput'].map((c) => `import ${c} from '${cp}/${c}.astro';`).join('\n')}\n${css}\nconst theme=generateTheme('#5268E0');\n---\n<ThemeProvider {theme} modeStorage={false}>\n <div class="custom-theme">\n  <ThemeName {theme} label="Theme title" /><h3>Brand color</h3>\n  <ThemeGenerator {theme} role="primary">\n   <ColorArea value="#5268E0" thumbText="B" />\n   <ColorSlider channel="h" label="Color tone" /><ColorInput value="#5268E0" />\n  </ThemeGenerator>\n  <ThemeMode value="system">Use device</ThemeMode>\n  <ThemeMode value="light">Day</ThemeMode>\n  <ThemeMode value="dark">Night</ThemeMode>\n </div>\n</ThemeProvider>\n<style is:global>\n${style}\n</style>`;
  const markup = `<tk-provider class="tk-scope tk-generator" data-config='{"mode":"system","modeStorage":false}'>\n${customThemeMarkup()}\n</tk-provider>`;
  return `<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"></script>
${markup}
<script>
const provider = document.querySelector('tk-provider');
const options = { theme: ThemeStudio.generateTheme('#5268E0'), modeStorage: false };
provider.setStore(ThemeStudio.createThemeStore(options), options);
</script>
<style>
${style}
</style>`;
}

export function themeExample(
  integration: Integration,
  variant: ThemeVariant,
  settings: CustomSettings = { ...defaultCustom, text: 'B', size: 26 },
  selection: TokenSelection = themeExampleSelection(variant),
) {
  if (variant === 'editing') return recipeSource('theme-studio', integration);
  if (variant === 'palette') return paletteExample(integration);
  let source = withApplicationPreview(
    baseThemeExample(integration, variant, selection),
    integration,
    selection.roles,
  );
  if (variant !== 'presets' && variant !== 'custom')
    source = source
      .replaceAll("ThemeStudio.browserModeStorage('app:mode')", 'false')
      .replaceAll(
        "browserModeStorage('app:mode')",
        integration === 'Angular' ? 'false as const' : 'false',
      )
      .replaceAll(', browserModeStorage', '')
      .replace('modeStorageKey="app:mode"', 'modeStorage={false}')
      .replaceAll('mode="system"', 'mode="light"')
      .replaceAll("mode: 'system'", "mode: 'light'");
  if (variant === 'disabled')
    source = disableExample(source, integration, true);
  if (
    variant === 'geometry' &&
    selection.modes?.length === 1 &&
    selection.modes[0] === 'dark'
  )
    source = source
      .replaceAll('mode="light"', 'mode="dark"')
      .replaceAll("mode: 'light'", "mode: 'dark'");
  if (variant !== 'custom') return source;
  const text = settings.text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return source
    .replaceAll('thumbText="B"', `thumbText="${text}"`)
    .replaceAll('>B</span>', `>${text}</span>`)
    .replace(
      customStyle({ ...defaultCustom, text: 'B', size: 26 }, '.custom-theme'),
      customStyle(settings, '.custom-theme'),
    )
    .replaceAll(
      integration === 'Svelte'
        ? '.custom-theme [data-cp-part="thumb-text"]'
        : '__unused__',
      '.custom-theme :global([data-cp-part="thumb-text"])',
    )
    .replaceAll(
      integration === 'Svelte'
        ? '.custom-theme input[type="range"]'
        : '__unused__',
      '.custom-theme :global(input[type="range"])',
    )
    .replaceAll(
      integration === 'Svelte' ? '.custom-theme button' : '__unused__',
      '.custom-theme :global(button)',
    )
    .replace(
      ' :global(button)[aria-pressed="true"]',
      ' :global(button[aria-pressed="true"])',
    );
}
export function themeExampleSelection(variant: ThemeVariant): TokenSelection {
  if (variant === 'single' || variant === 'custom')
    return { roles: ['primary'] };
  if (variant === 'geometry')
    return {
      roles: ['primary'],
      radius: ['card'],
      width: ['button'],
      modes: ['light'],
    };
  return {
    roles: ['primary', 'secondary', 'accent'],
    radius: ['card'],
    width: ['card'],
    background: true,
    modes: ['light', 'dark'],
  };
}
function nativeThemeMarkup(variant: ThemeVariant, selection: TokenSelection) {
  const options = {
    view:
      variant === 'rectangle' || variant === 'geometry'
        ? 'area'
        : variant === 'single'
          ? 'wheel'
          : 'shared-wheel',
    roles: selection.roles,
    controls: false,
  };
  const picker = themePickerMarkup.replace(
    '<tk-picker>',
    `<tk-picker data-options='${JSON.stringify(options)}'>`,
  );
  const themes = [
    generateTheme('#5268E0', { name: 'Indigo' }),
    generateTheme('#277D59', { name: 'Forest' }),
    generateTheme('#C25D3D', { name: 'Terracotta' }),
  ];
  const presets = `<tk-select data-themes='${JSON.stringify(themes)}'><label class="cp-format">Theme<select><option value="" disabled>Custom theme</option>${themes.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}</select></label></tk-select>`;
  const geometry = [
    ...(selection.radius ?? []).map(
      (target) =>
        `<label class="tk-border"><span>${target} radius</span><span class="tk-border-field"><input type="number" min="0" max="1000" step=".125" data-tk-border="radius" data-target="${target}"><span aria-hidden="true">rem</span></span></label>`,
    ),
    ...(selection.width ?? []).map(
      (target) =>
        `<label class="tk-border"><span>${target} border width</span><span class="tk-border-field"><input type="number" min="0" max="1000" step="1" data-tk-border="width" data-target="${target}"><span aria-hidden="true">px</span></span></label>`,
    ),
  ].join('\n  ');
  return `<tk-provider class="tk-scope tk-generator" data-config='${JSON.stringify({ mode: 'light', modeStorage: false, selection })}'>\n  ${variant === 'single' || selection.modes?.length === 1 ? '' : '<div class="mode-buttons"><button data-tk-mode="system">System</button><button data-tk-mode="light">Light</button><button data-tk-mode="dark">Dark</button></div>'}\n  ${variant === 'presets' ? presets : `<label class="tk-name">Theme name<input data-tk-name maxlength="200"></label>\n  ${picker}\n  ${variant === 'shared' || variant === 'rectangle' ? '<div class="tk-harmony"><label>Harmony<select data-tk-harmony><option value="analogous">Analogous</option><option value="triadic">Triadic</option><option value="split-complementary">Split complementary</option></select></label><button data-tk-generate-harmony>Generate accent &amp; secondary</button></div>' : ''}\n  ${geometry}\n  ${selection.background ? '<label class="tk-background"><input type="checkbox" data-tk-background>Tint background with primary</label>' : ''}`}\n  <tk-export format="json"><pre class="tk-export"></pre></tk-export>\n</tk-provider>`;
}
export function modeExample(integration: Integration) {
  const pkg = packageFor('theme-studio', integration);
  if (integration === 'React')
    return `import { useThemeMode } from '${pkg}';\n\n// Render this component inside ThemeProvider.\nexport function AppearanceControls() {\n const mode = useThemeMode();\n return <div className="appearance-controls">\n   <button aria-pressed={mode.preference === 'system'} onClick={() => mode.setMode('system')}>Use device</button>\n   <button aria-pressed={mode.preference === 'light'} onClick={() => mode.setMode('light')}>Day</button>\n   <button aria-pressed={mode.preference === 'dark'} onClick={() => mode.setMode('dark')}>Night</button>\n </div>;\n}`;
  if (integration === 'Svelte')
    return `<script lang="ts">\n import { useThemeMode } from '${pkg}';\n // Render this child component inside ThemeProvider.\n const mode = useThemeMode();\n</script>\n<div class="appearance-controls">\n <button aria-pressed={$mode.preference === 'system'} onclick={() => mode.setMode('system')}>Use device</button>\n <button aria-pressed={$mode.preference === 'light'} onclick={() => mode.setMode('light')}>Day</button>\n <button aria-pressed={$mode.preference === 'dark'} onclick={() => mode.setMode('dark')}>Night</button>\n</div>`;
  if (integration === 'Vue')
    return `<script setup lang="ts">\nimport { useThemeMode } from '${pkg}';\n// Render this child component inside ThemeProvider.\nconst mode = useThemeMode();\n</script>\n<template><div class="appearance-controls">\n <button :aria-pressed="mode.preference.value === 'system'" @click="mode.setMode('system')">Use device</button>\n <button :aria-pressed="mode.preference.value === 'light'" @click="mode.setMode('light')">Day</button>\n <button :aria-pressed="mode.preference.value === 'dark'" @click="mode.setMode('dark')">Night</button>\n</div></template>`;
  if (integration === 'Angular')
    return `import { Component } from '@angular/core';\nimport { useThemeMode } from '${pkg}';\n// Render this child component inside tk-provider.\n@Component({selector:'app-appearance',standalone:true,\n template:\`<div class="appearance-controls">\n  <button [attr.aria-pressed]="mode.preference() === 'system'" (click)="mode.setMode('system')">Use device</button>\n  <button [attr.aria-pressed]="mode.preference() === 'light'" (click)="mode.setMode('light')">Day</button>\n  <button [attr.aria-pressed]="mode.preference() === 'dark'" (click)="mode.setMode('dark')">Night</button>\n </div>\`})\nexport class AppearanceControls {readonly mode=useThemeMode();}`;
  return `<!-- Place these controls inside ThemeProvider / tk-provider. -->\n<!-- Astro: ThemeProvider registers the native client automatically.\n     Vanilla: load theme-studio.js once in the outer page. -->\n<div class="appearance-controls">\n <button type="button" data-tk-mode="system">Use device</button>\n <button type="button" data-tk-mode="light">Day</button>\n <button type="button" data-tk-mode="dark">Night</button>\n</div>\n<!-- ThemeStudio.themeModeActions(provider.store).cycle() is also available\n     for a custom cycle button. -->`;
}

function withColorLayout(source: string, integration: Integration) {
  const layout =
    '.picker-parts { display: grid; gap: var(--cp-gap, 16px); width: 100%; max-width: 360px; }\n.picker-parts cp-provider { display: contents; }';
  const globalLayout =
    integration === 'Svelte'
      ? layout.replace(' cp-provider', ' :global(cp-provider)')
      : layout;
  if (integration === 'React') {
    const marker = '/* Add to your stylesheet: */';
    return source.includes(marker)
      ? source.replace(marker, marker + '\n' + layout)
      : source + '\n\n' + marker + '\n' + layout;
  }
  if (integration === 'Angular') return source + '\n' + layout;
  if (source.includes('</style>'))
    return source.replace('</style>', globalLayout + '\n</style>');
  return (
    source +
    `\n<style${integration === 'Astro' ? ' is:global' : ''}>\n${globalLayout}\n</style>`
  );
}

export function standaloneExample(integration: Integration) {
  const pkg = packageFor('theme-studio', integration);
  const content =
    '<section class="app-preview"><h3>Project settings</h3><button type="button">Save changes</button></section>';
  const style = `.app-preview { padding: 24px; background: hsl(var(--background)); color: hsl(var(--foreground)); border: var(--border-width-card) solid hsl(var(--primary)); border-radius: var(--border-radius-card); }\n.app-preview button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 16px; border: 0; border-radius: var(--border-radius-button); }`;
  if (integration === 'React')
    return `import { ThemeProvider, generateTheme } from '${pkg}';\nimport '${stylesheetFor(pkg)}';\n\nconst theme = generateTheme('#277D59', { name: 'Forest' });\nexport function StandaloneTheme() {\n  return <ThemeProvider theme={theme} mode="system" modeStorage={false}>\n    ${content.replaceAll('class=', 'className=')}\n  </ThemeProvider>;\n}\n/* Global stylesheet */\n${style}`;
  if (integration === 'Svelte')
    return `<script lang="ts">\n import { ThemeProvider, generateTheme } from '${pkg}';\n import '${stylesheetFor(pkg)}';\n const theme = generateTheme('#277D59', { name: 'Forest' });\n</script>\n<ThemeProvider options={{ theme, mode: 'system', modeStorage: false }}>\n ${content}\n</ThemeProvider>\n<style>\n${style}\n</style>`;
  if (integration === 'Vue')
    return `<script setup lang="ts">\nimport { ThemeProvider, generateTheme } from '${pkg}';\nimport '${stylesheetFor(pkg)}';\nconst theme = generateTheme('#277D59', { name: 'Forest' });\n</script>\n<template><ThemeProvider :options="{ theme, mode: 'system', modeStorage: false }">\n ${content}\n</ThemeProvider></template>\n<style>\n${style}\n</style>`;
  if (integration === 'Angular')
    return `import { Component } from '@angular/core';\nimport { ThemeProvider, generateTheme } from '${pkg}';\n@Component({ selector: 'app-standalone-theme', standalone: true,\n imports: [ThemeProvider],\n template: \`<tk-provider [options]="options">${content}</tk-provider>\` })\nexport class StandaloneTheme {\n readonly options = { theme: generateTheme('#277D59', { name: 'Forest' }),\n   mode: 'system' as const, modeStorage: false as const };\n}\n/* Global stylesheet */\n@import '${stylesheetFor(pkg)}';\n${style}`;
  if (integration === 'Astro')
    return `---\nimport { generateTheme } from '${pkg}';\nimport ThemeProvider from '${pkg}/ThemeProvider.astro';\nimport '${stylesheetFor(pkg)}';\nconst theme = generateTheme('#277D59', { name: 'Forest' });\n---\n<ThemeProvider {theme} mode="system" modeStorage={false}>\n ${content}\n</ThemeProvider>\n<style>\n${style}\n</style>`;
  return `<link rel="stylesheet" href="/assets/theme-studio.min.css">\n<script src="/assets/theme-studio.min.js"></script>\n<tk-provider class="tk-scope">${content}</tk-provider>\n<script>\nconst options = { theme: ThemeStudio.generateTheme('#277D59', { name: 'Forest' }),\n  mode: 'system', modeStorage: false };\nconst provider = document.querySelector('tk-provider');\nprovider.setStore(ThemeStudio.createThemeStore(options), options);\n</script>\n<style>\n${style}\n</style>`;
}
export function renderingExample(integration: Integration, scenario: string) {
  if (scenario === 'standalone') return standaloneExample(integration);
  const timeout = scenario === 'timeout' ? 2000 : 5000;
  const source = loaderExample(integration)
    .replaceAll('10000', String(timeout))
    .replace(
      "generateTheme('#5268E0')",
      "generateTheme('#5268E0', { name: 'Indigo fallback' })",
    );
  return source;
}

const applicationContent = `<h3>Project settings</h3>
  <p>Sample controls using the theme's CSS variables.</p>
  <label>Project name<input value="Website redesign" /></label>
  <div class="app-actions"><button type="button">Save changes</button><button type="button" class="secondary">Cancel</button></div>
  <aside>Accent surface</aside>`;
const applicationStyles = `.app-preview { display: grid; gap: 16px; padding: 24px; background: hsl(var(--background)); color: hsl(var(--foreground)); border: var(--border-width-card) solid hsl(var(--primary)); border-radius: var(--border-radius-card); }
.app-preview h3, .app-preview p { margin: 0; }
.app-preview label { display: grid; gap: 8px; }
.app-preview input { background: hsl(var(--background)); color: hsl(var(--foreground)); border: var(--border-width-input) solid hsl(var(--primary)); border-radius: var(--border-radius-input); padding: 10px; }
.app-actions { display: flex; gap: 8px; }
.app-actions button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 16px; border: 0; border-radius: var(--border-radius-button); }
.app-actions .secondary { background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); }
.app-preview aside { background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); padding: 16px; border-radius: var(--border-radius-card); }`;
function withApplicationPreview(source: string, integration: Integration, roles: readonly string[] = ['primary', 'secondary', 'accent']) {
  const markup = roles.includes('accent') ? applicationContent : applicationContent.replace('<aside>Accent surface</aside>', '');
  const content =
    integration === 'React'
      ? markup
          .replaceAll('class=', 'className=')
          .replace('input value=', 'input defaultValue=')
      : markup;
  let result = source.replace('Your application content', content);
  if (!result.includes('app-preview')) {
    const close =
      integration === 'Angular' || integration === 'Vanilla'
        ? '</tk-provider>'
        : '</ThemeProvider>';
    result = result.replace(
      close,
      `<section ${integration === 'React' ? 'className' : 'class'}="app-preview">${content}</section>\n${close}`,
    );
  }
  result = result.replace(/\/\* \.app-preview \{[^}]*\} \*\//, '');
  if (result.includes('</style>'))
    return result.replace('</style>', applicationStyles + '\n</style>');
  if (integration === 'React' || integration === 'Angular') {
    const marker =
      /\/\* (?:Add to your stylesheet:|In your global stylesheet:|Global stylesheet:?) \*\//;
    return (
      result +
      (marker.test(result) ? '\n' : '\n/* Global stylesheet */\n') +
      applicationStyles
    );
  }
  return (
    result +
    `\n<style${integration === 'Astro' ? ' is:global' : ''}>\n${applicationStyles}\n</style>`
  );
}
export function loaderExample(integration: Integration) {
  const source = baseLoaderExample(integration)
    .replace(
      '<section>Your themed content</section>',
      `<section class="app-preview">${applicationContent}</section>`,
    )
    .replace(
      '<tk-ready>Your themed content</tk-ready>',
      `<tk-ready><section class="app-preview">${applicationContent}</section></tk-ready>`,
    )
    .replace(
      '<section id="content">Your themed content</section>',
      `<section id="content" class="app-preview">${applicationContent}</section>`,
    );
  return withApplicationPreview(
    integration === 'React'
      ? source
          .replaceAll('class=', 'className=')
          .replace('input value=', 'input defaultValue=')
      : source,
    integration,
  );
}

function disableExample(
  source: string,
  integration: Integration,
  theme: boolean,
) {
  if (!theme) {
    if (
      integration === 'React' ||
      integration === 'Svelte' ||
      integration === 'Astro'
    )
      return source.replace('<ColorProvider ', '<ColorProvider disabled ');
    if (integration === 'Vue')
      return source.replace(
        '<ColorProvider ',
        '<ColorProvider :disabled="true" ',
      );
    if (integration === 'Angular')
      return source.replace('<cp-provider ', '<cp-provider [disabled]="true" ');
    return source.replace('<cp-provider ', '<cp-provider disabled ');
  }
  if (integration === 'React' || integration === 'Astro')
    return source.replace('<ThemeProvider ', '<ThemeProvider disabled ');
  return source
    .replace('theme: themes[0]', 'disabled: true, theme: themes[0]')
    .replace('theme: this.themes[0]', 'disabled: true, theme: this.themes[0]')
    .replace(
      'theme: ThemeStudio.generateTheme(',
      'disabled: true, theme: ThemeStudio.generateTheme(',
    );
}
export interface SwatchSettings {
  shape: 'square' | 'circle' | 'joined';
  label: string;
  gap: number;
  size: number;
}
export const defaultSwatch: SwatchSettings = {
  shape: 'joined',
  label: '500',
  gap: 4,
  size: 48,
};
export function paletteStyle(settings: SwatchSettings) {
  return `.brand-palette { --tk-palette-gap: ${settings.gap}px; --tk-swatch-height: ${settings.size}px; --tk-swatch-radius: 10px; }\n.brand-shade-label { font-size: 11px; font-weight: 600; }\n.brand-shade { outline: 1px solid rgb(0 0 0 / 8%); outline-offset: -1px; }`;
}
export function paletteExample(
  i: Integration,
  settings: SwatchSettings = defaultSwatch,
) {
  const pkg = packageFor('theme-studio', i);
  const classes =
    "{ root: 'brand-palette', label: 'brand-shade-label', swatch: 'brand-shade' }";
  const labels = JSON.stringify({ 500: settings.label }).replaceAll(
    '<',
    '\\u003c',
  );
  const setup = `const classes = ${classes};\nconst labels = ${labels};`;
  const props = `role="primary" shape="${settings.shape}" classes={classes} labels={labels}`;
  const css = paletteStyle(settings);
  if (i === 'React')
    return `import { ThemeProvider, ThemePalette, generateTheme } from '${pkg}';\nimport '${stylesheetFor(pkg)}';\n${setup}\nexport function Shades() {\n  return <ThemeProvider theme={generateTheme('#5268E0')}><ThemePalette ${props} /></ThemeProvider>;\n}\n/* Global stylesheet */\n${css}`;
  if (i === 'Svelte')
    return `<script lang="ts">\nimport { ThemeProvider, ThemePalette, generateTheme } from '${pkg}';\nimport '${stylesheetFor(pkg)}';\n${setup}\n</script>\n<ThemeProvider options={{ theme: generateTheme('#5268E0') }}><ThemePalette ${props} /></ThemeProvider>\n<style>\n${css.replace('.brand-palette', ':global(.brand-palette)').replace('.brand-shade-label', ':global(.brand-shade-label)').replace('.brand-shade {', ':global(.brand-shade) {')}\n</style>`;
  if (i === 'Vue')
    return `<script setup lang="ts">\nimport { ThemeProvider, ThemePalette, generateTheme } from '${pkg}';\nimport '${stylesheetFor(pkg)}';\n${setup}\n</script>\n<template><ThemeProvider :options="{ theme: generateTheme('#5268E0') }"><ThemePalette role="primary" shape="${settings.shape}" :classes="classes" :labels="labels" /></ThemeProvider></template>\n<style>\n${css}\n</style>`;
  if (i === 'Angular')
    return `import { Component } from '@angular/core';\nimport { ThemeProvider, ThemePalette, generateTheme } from '${pkg}';\n@Component({ selector: 'app-shades', standalone: true, imports: [ThemeProvider, ThemePalette], template: \`<tk-provider [options]="options"><tk-palette role="primary" shape="${settings.shape}" [classes]="classes" [labels]="labels" /></tk-provider>\` })\nexport class Shades { readonly options = { theme: generateTheme('#5268E0') }; readonly classes = ${classes}; readonly labels = ${labels}; }\n/* Global stylesheet */\n@import '${stylesheetFor(pkg)}';\n${css}`;
  if (i === 'Astro')
    return `---\nimport { generateTheme } from '${pkg}';\nimport ThemeProvider from '${pkg}/ThemeProvider.astro';\nimport ThemePalette from '${pkg}/ThemePalette.astro';\nimport '${stylesheetFor(pkg)}';\nconst theme = generateTheme('#5268E0');\n${setup}\n---\n<ThemeProvider {theme}><ThemePalette {theme} ${props} /></ThemeProvider>\n<style is:global>\n${css}\n</style>`;
  return `<link rel="stylesheet" href="/assets/theme-studio.min.css">\n<script src="/assets/theme-studio.min.js"></script>\n<tk-provider class="tk-scope"><div id="palette"></div></tk-provider>\n<script>\n${setup}\nconst provider = document.querySelector('tk-provider');\nprovider.setStore(ThemeStudio.createThemeStore({ theme: ThemeStudio.generateTheme('#5268E0') }));\ndocument.querySelector('#palette').innerHTML = ThemeStudio.themePaletteMarkup('primary', { shape: '${settings.shape}', classes, labels });\n</script>\n<style>\n${css}\n</style>`;
}
