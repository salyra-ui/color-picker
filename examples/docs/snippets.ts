export type Integration = 'React' | 'Svelte' | 'Vue' | 'Angular' | 'Astro' | 'Vanilla' | 'PHP' | 'htmx';
export const integrations: Integration[] = ['React','Svelte','Vue','Angular','Astro','Vanilla','PHP','htmx'];
export const examples: Record<Integration, { color: string; theme: string; note: string }> = {
  React: {
    note: 'Compose primitives in a provider. Hooks can read and edit the closest context; use one store per SSR request.',
    color: `import { useState } from 'react';
import { createColorStore } from '@sebytza23/color-picker';
import { ColorProvider, ColorSurface, ColorViewSelect,
  ColorSlider, ColorFormatSelect, ColorInput } from '@sebytza23/color-picker-react';
import '@sebytza23/color-picker/styles.css';

export function Picker() {
  const [store] = useState(() => createColorStore('#6366f180'));
  return <ColorProvider store={store} onChange={() => {
    console.log(store.getColor().name, store.getValue('hsl'));
  }}>
    <ColorViewSelect /><ColorSurface />
    <ColorSlider channel="alpha" />
    <ColorFormatSelect /><ColorInput />
  </ColorProvider>;
}`,
    theme: `import { generateTheme, browserModeStorage } from '@sebytza23/theme-kit';
import { ThemeProvider, ThemePicker, ThemeName, ThemeSelect,
  ThemeMode, ThemeExport } from '@sebytza23/theme-kit-react';
import '@sebytza23/color-picker/styles.css';
import '@sebytza23/theme-kit/styles.css';

const themes = [generateTheme('#6366f1'), generateTheme('#277d59')];
export function App() {
  return <ThemeProvider theme={themes[0]} mode="system"
    modeStorage={browserModeStorage('my-app:mode')}>
    <ThemeMode value="system">🖥 System</ThemeMode>
    <ThemeMode value="light">☀ Light</ThemeMode>
    <ThemeMode value="dark">🌙 Dark</ThemeMode>
    <ThemeName /><ThemeSelect themes={themes} />
    <ThemePicker view="shared-wheel" />
    <ThemeExport onChange={config => console.log(config)} />
  </ThemeProvider>;
}`,
  },
  Svelte: {
    note: 'Native Svelte 5 components. Snippets customize the content; useThemeMode() is a subscribable store with setMode() and cycle().',
    color: `<script>
  import { createColorStore } from '@sebytza23/color-picker';
  import { ColorProvider, ColorSurface, ColorViewSelect,
    ColorSlider, ColorFormatSelect, ColorInput } from '@sebytza23/color-picker-svelte';
  import '@sebytza23/color-picker/styles.css';
  const store = createColorStore('#6366f180');
</script>
<ColorProvider {store} onChange={() => console.log(store.getColor())}>
  <ColorViewSelect /><ColorSurface /><ColorSlider channel="alpha" />
  <ColorFormatSelect /><ColorInput />
</ColorProvider>`,
    theme: `<script>
  import { generateTheme, browserModeStorage } from '@sebytza23/theme-kit';
  import { ThemeProvider, ThemePicker, ThemeName, ThemeSelect,
    ThemeMode, ThemeExport } from '@sebytza23/theme-kit-svelte';
  import '@sebytza23/color-picker/styles.css';
  import '@sebytza23/theme-kit/styles.css';
  const themes = [generateTheme('#6366f1'), generateTheme('#277d59')];
</script>
<ThemeProvider options={{ theme: themes[0], mode: 'system',
  modeStorage: browserModeStorage('my-app:mode') }}>
  <ThemeMode value="dark">{#snippet children(mode)}🌙 Dark{/snippet}</ThemeMode>
  <ThemeName /><ThemeSelect {themes} />
  <ThemePicker view="shared-wheel" />
  <ThemeExport onChange={config => console.log(config)} />
</ThemeProvider>`,
  },
  Vue: {
    note: 'Native Vue 3 components and scoped slots. useThemeMode() returns computed preference/resolvedMode refs and actions.',
    color: `<script setup>
import { createColorStore } from '@sebytza23/color-picker';
import { ColorProvider, ColorSurface, ColorViewSelect,
  ColorSlider, ColorFormatSelect, ColorInput } from '@sebytza23/color-picker-vue';
import '@sebytza23/color-picker/styles.css';
const store = createColorStore('#6366f180');
</script>
<template>
  <ColorProvider :store="store" @change="console.log(store.getColor())">
    <ColorViewSelect /><ColorSurface /><ColorSlider channel="alpha" />
    <ColorFormatSelect /><ColorInput />
  </ColorProvider>
</template>`,
    theme: `<script setup>
import { generateTheme } from '@sebytza23/theme-kit';
import { ThemeProvider, ThemePicker, ThemeName, ThemeSelect,
  ThemeMode, ThemeExport } from '@sebytza23/theme-kit-vue';
import '@sebytza23/color-picker/styles.css';
import '@sebytza23/theme-kit/styles.css';
const themes = [generateTheme('#6366f1'), generateTheme('#277d59')];
</script>
<template>
  <ThemeProvider :options="{ theme: themes[0], mode: 'system' }">
    <ThemeMode value="dark">🌙 Dark</ThemeMode>
    <ThemeName /><ThemeSelect :themes="themes" />
    <ThemePicker view="shared-wheel" />
    <ThemeExport @change="config => console.log(config)" />
  </ThemeProvider>
</template>`,
  },
  Angular: {
    note: 'Standalone Angular components; include them in imports. useThemeMode() exposes readonly signals plus actions inside the provider injection context.',
    color: `import { Component } from '@angular/core';
import { createColorStore } from '@sebytza23/color-picker';
import { ColorProvider, ColorSurface, ColorViewSelect,
  ColorSlider, ColorFormatSelect, ColorInput } from '@sebytza23/color-picker-angular';

@Component({ standalone: true, selector: 'app-picker',
  imports: [ColorProvider, ColorSurface, ColorViewSelect,
    ColorSlider, ColorFormatSelect, ColorInput],
  template: \`<cp-provider [store]="store" (colorChange)="changed()">
    <cp-view-select /><cp-surface /><cp-slider channel="alpha" />
    <cp-format-select /><cp-input />
  </cp-provider>\` })
export class Picker {
  readonly store = createColorStore('#6366f180');
  changed() { console.log(this.store.getColor()); }
}
// Add color-picker/styles.css to the application's global styles.`,
    theme: `import { Component } from '@angular/core';
import { generateTheme, type ThemeOptions } from '@sebytza23/theme-kit';
import { ThemeProvider, ThemeMode, ThemeName, ThemePicker,
  ThemeSelect, ThemeExport } from '@sebytza23/theme-kit-angular';

@Component({ standalone: true, selector: 'app-themes',
  imports: [ThemeProvider, ThemeMode, ThemeName, ThemePicker,
    ThemeSelect, ThemeExport],
  template: \`<tk-provider [options]="options">
    <tk-mode value="dark"><ng-template>🌙 Dark</ng-template></tk-mode>
    <tk-name /><tk-select [themes]="themes" /><tk-picker />
    <tk-export (configurationChange)="save($event)" />
  </tk-provider>\` })
export class Themes {
  readonly themes = [generateTheme('#6366f1'), generateTheme('#277d59')];
  readonly options: ThemeOptions = { theme: this.themes[0], mode: 'system' };
  save(config: unknown) { console.log(config); }
}
// Add both packages' styles.css to the application's global styles.`,
  },
  Astro: {
    note: 'Astro renders initial HTML and CSS on the server. Native custom elements add interaction; no framework island is required.',
    color: `---
import ColorProvider from '@sebytza23/color-picker-astro/ColorProvider.astro';
import ColorWheel from '@sebytza23/color-picker-astro/ColorWheel.astro';
import ColorSlider from '@sebytza23/color-picker-astro/ColorSlider.astro';
import ColorInput from '@sebytza23/color-picker-astro/ColorInput.astro';
import '@sebytza23/color-picker/styles.css';
---
<ColorProvider value="#6366f180" view="wheel">
  <ColorWheel value="#6366f180" />
  <ColorSlider channel="alpha" /><ColorInput />
  <cp-output format="name"><output></output></cp-output>
</ColorProvider>
<script>
  import type { ColorProviderElement } from '@sebytza23/color-picker-astro/client';
  document.querySelector('cp-provider')?.addEventListener('color-change', e => {
    console.log((e.currentTarget as ColorProviderElement).store?.getColor());
  });
</script>`,
    theme: `---
import { generateTheme } from '@sebytza23/theme-kit';
import ThemeProvider from '@sebytza23/theme-kit-astro/ThemeProvider.astro';
import ThemePicker from '@sebytza23/theme-kit-astro/ThemePicker.astro';
import ThemeMode from '@sebytza23/theme-kit-astro/ThemeMode.astro';
import ThemeName from '@sebytza23/theme-kit-astro/ThemeName.astro';
import ThemeExport from '@sebytza23/theme-kit-astro/ThemeExport.astro';
import '@sebytza23/color-picker/styles.css';
import '@sebytza23/theme-kit/styles.css';
const theme = generateTheme('#6366f1');
---
<ThemeProvider {theme} mode="system" modeStorageKey="my-app:mode">
  <ThemeMode value="dark">🌙 Dark</ThemeMode>
  <ThemeName {theme} /><ThemePicker {theme} view="shared-wheel" />
  <ThemeExport {theme} />
</ThemeProvider>
<script>
  document.querySelector('tk-export')?.addEventListener('configuration-change', e => {
    console.log((e as CustomEvent).detail);
  });
</script>`,
  },
  Vanilla: {
    note: 'Native DOM, no framework dependencies. Mount the ready layout or compose cp-* / tk-* elements yourself. All options and stores remain available.',
    color: `import { mountColorPicker } from '@sebytza23/color-picker-vanilla';
import '@sebytza23/color-picker/styles.css';

const picker = mountColorPicker(document.querySelector('#color'), {
  value: '#6366f180', view: 'wheel',
  onChange(color) { console.log(color.name, color.hex, color.hsl, color.oklch); },
});
const hsl = picker.getValue('hsl');
// picker.destroy(); // removes DOM and subscriptions`,
    theme: `import { mountThemeKit, generateTheme, browserStorage,
  browserModeStorage } from '@sebytza23/theme-kit-vanilla';
import '@sebytza23/color-picker/styles.css';
import '@sebytza23/theme-kit/styles.css';

const themes = [generateTheme('#6366f1'), generateTheme('#277d59')];
const kit = mountThemeKit(document.querySelector('#theme'), {
  theme: themes[0], themes, mode: 'system',
  storage: browserStorage('my-app:theme'),
  modeStorage: browserModeStorage('my-app:mode'),
  picker: { view: 'shared-wheel' },
  onChange(config) { console.log(config.theme, config.modePreference, config.css); },
});
kit.store.setName('My own theme');
// kit.destroy();`,
  },
  PHP: {
    note: 'PHP produces HTML; the browser runs the picker. No PHP extension is needed. Copy the built JS/CSS assets into your public directory; keep server data escaped.',
    color: `<?php $color = '#6366f180'; ?>
<link rel="stylesheet" href="/vendor/color-picker/styles.css">
<div id="color"></div>
<script src="/vendor/color-picker/color-picker.js"></script>
<script>
const picker = ColorPicker.mountColorPicker(document.querySelector('#color'), {
  value: <?= json_encode($color, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>,
  onChange(color) { console.log(color.name, color.formats, color.rgb); }
});
</script>`,
    theme: `<link rel="stylesheet" href="/vendor/color-picker/styles.css">
<link rel="stylesheet" href="/vendor/theme-kit/styles.css">
<div id="theme"></div>
<form method="post"><input type="hidden" name="theme_json"><button>Save theme</button></form>
<!-- This bundle includes the color-picker dependency. -->
<script src="/vendor/theme-kit/theme-kit.js"></script>
<script>
const themes = [ThemeKit.generateTheme('#6366f1'), ThemeKit.generateTheme('#277d59')];
const kit = ThemeKit.mountThemeKit(document.querySelector('#theme'), {
  themes, theme: themes[0], mode: 'system',
  onChange(config) {
    document.querySelector('input[name="theme_json"]').value = config.json;
  }
});
</script>
<!-- Validate submitted theme JSON on your server before storing it. -->`,
  },
  htmx: {
    note: 'Load the bundle once in the outer page. Declarative components connect on insertion and clean up on removal; no htmx reinitialization hook is needed.',
    color: `<!-- Outer page: load color-picker.js + styles.css once. -->
<!-- HTML fragment returned by your PHP/HTML endpoint: -->
<cp-provider value="#6366f180" view="wheel">
  <cp-wheel><div data-area class="cp-wheel" role="group" tabindex="0"
    aria-label="Hue and saturation wheel"><span data-cp-part="thumb"></span></div></cp-wheel>
  <cp-slider channel="alpha"><label class="cp-slider" data-channel="alpha">Alpha
    <input type="range" min="0" max="100" step="1"></label></cp-slider>
  <cp-input></cp-input>
  <cp-output format="json"><output></output></cp-output>
</cp-provider>
<!-- color-values bubbles with the color name and all formats. -->`,
    theme: `<!-- Outer page: load theme-kit.js + both stylesheets once. -->
<!-- Fragment: no framework or client initializer needed. -->
<tk-provider data-config='{"mode":"system","storageKey":"my-app:theme","modeStorageKey":"my-app:mode"}'>
  <button type="button" data-tk-mode="system">🖥 System</button>
  <button type="button" data-tk-mode="dark">🌙 Dark</button>
  <label>Theme name<input data-tk-name maxlength="200"></label>
  <cp-provider data-theme-generator data-role="primary">
    <cp-input></cp-input>
  </cp-provider>
  <tk-export format="json"><pre class="tk-export"></pre></tk-export>
  <div class="tk-preview">My themed content</div>
</tk-provider>
<!-- configuration-change bubbles with the complete theme + CSS + JSON. -->`,
  },
};
