// Copy this file into a clean consumer with both packed packages and React installed.
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { getColor, createColorStore, setColorChannel } from '@sebytza23/color-picker';
import {
  ColorProvider,
  ColorInput,
  ColorAlphaInput,
  ColorWheel,
} from '@sebytza23/color-picker-react';
import {
  themeConfiguration,
  createHttpThemeLoader,
  themeList,
  selectThemeTokens,
  createThemeStore,
  generateTheme,
  createThemePickerStore,
  themePickerMarkers,
} from '@sebytza23/theme-kit';
import {
  ThemeProvider,
  ThemeGenerator,
  ThemePicker,
  ThemeSelect,
  ThemeExport,
} from '@sebytza23/theme-kit-react';

const color = createColorStore('#123456', 'rgb');
setColorChannel(color, 'rgb', 0, 120);
assert.equal(color.getSnapshot().hex, '#783456');
const picker = renderToString(
  h(ColorProvider, { store: color }, h(ColorInput)),
);
for (const channel of ['R', 'G', 'B']) {
  assert.ok(picker.includes(`aria-label="RGB ${channel}"`));
}
assert.equal((picker.match(/type="number"/g) ?? []).length, 3);

const theme = generateTheme('#6366F1', { background: 'tinted' });
const store = createThemeStore({ theme, mode: 'dark' });
const html = renderToString(h(ThemeProvider, { store }, h(ThemeGenerator)));
assert.ok(html.includes('data-mode="dark"'));
assert.ok(html.includes('--background:'));
assert.equal(store.getSnapshot().status, 'ready');
console.log(
  'Packed packages: native Node ESM, separate RGB fields, React SSR and theme composition passed.',
);

assert.equal(getColor('#123456').name, 'Prussian Blue');
assert.deepEqual(color.getValue('rgb'), { r: 120, g: 52, b: 86, alpha: 1 });
store.setBorder('radius', 'card', 1.25);
assert.deepEqual(
  selectThemeTokens(store.getSnapshot().theme, { roles: [], radius: ['card'] }),
  { '--border-radius-card': '1.25rem' },
);
assert.deepEqual(Object.keys(store.getSnapshot().theme.structure.userPreset), [
  'primary',
  'secondary',
  'accent',
]);
console.log(
  'Packed naming, typed values, selective tokens and three-role schema passed.',
);

color.setAlpha(0.5);
assert.equal(color.getValue('hex'), '#78345680');
assert.equal(color.getValue('hsl').alpha, 0.5);
const transparent = renderToString(
  h(
    ColorProvider,
    { store: color },
    h(ColorWheel, { classes: { thumb: 'my-thumb' }, thumbText: 'X' }),
    h(ColorAlphaInput),
  ),
);
assert.ok(transparent.includes('my-thumb'));
assert.ok(transparent.includes('value="50"'));
const shared = createThemePickerStore(store, { roles: ['primary'] });
assert.equal(themePickerMarkers(shared.getSnapshot())[0].label, '');
const sharedHTML = renderToString(
  h(ThemeProvider, { store }, h(ThemePicker, { roles: ['primary'] })),
);
assert.ok(sharedHTML.includes('data-small="true"'));
console.log(
  'Packed alpha, custom wheel parts and single anonymous theme marker passed.',
);

const configuration = themeConfiguration(store.getSnapshot());
assert.equal(JSON.parse(configuration.json).mode, 'dark');
assert.equal(
  configuration.theme.structure.websitePreset.border.radius.card,
  1.25,
);
assert.equal(themeList([theme]).length, 1);
const configuredUI = renderToString(
  h(
    ThemeProvider,
    {
      store: createThemeStore({
        theme: configuration.theme,
        mode: configuration.mode,
      }),
    },
    h(ThemeSelect, { themes: [theme] }),
    h(ThemeExport, { format: 'css' }),
  ),
);
assert.ok(configuredUI.includes('Saved themes'));
assert.ok(configuredUI.includes('--border-radius-card:1.25rem'));
const remote = createHttpThemeLoader('/theme', {
  fetch: async () =>
    new Response(JSON.stringify(theme), { headers: { ETag: '"v1"' } }),
});
assert.equal((await remote(new AbortController().signal)).id, theme.id);
console.log(
  'Packed theme list, configuration export and conditional HTTP loader passed.',
);
