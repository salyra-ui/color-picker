# @salyra-ui/color-picker

Salyra UI color controls, conversions, named colors and picker state for React, Svelte, Vue, Angular, Astro and Vanilla.

![Color picker with hue, alpha and named color](https://salyra-ui.github.io/color-picker/npm/color-picker-controls.jpg)

![Separate RGB channel inputs](https://salyra-ui.github.io/color-picker/npm/color-picker-channels.jpg)

```bash
npm install @salyra-ui/color-picker
```

```ts
import { createColorStore } from '@salyra-ui/color-picker';

const store = createColorStore('#5268E080');
const color = store.getColor();
console.log(color.name, color.hex, color.rgb, color.hsl, color.formats);
store.setAlpha(0.5);
```

The store supports HEX, RGB, HSL, HSV, OKLCH and OKLab. Color names come from the bundled list and include an exact-match indicator. Each picker has independent state and can be initialized during server rendering.

## Framework entries

Install one package, then import the entry for your application:

```ts
import { ColorProvider, ColorInput } from '@salyra-ui/color-picker/svelte';
import '@salyra-ui/color-picker/styles.min.css';
```

Entries: `/react`, `/svelte`, `/vue`, `/angular`, `/astro`, `/vanilla`. Astro components are imported individually from `/astro/ColorProvider.astro` and the other component paths. Each entry re-exports the core helpers. Framework peer dependencies are optional. Other implementations are downloaded in the npm archive but do not enter your application bundle unless imported.

[Documentation and examples](https://salyra-ui.github.io/color-picker/docs.html?kit=color-picker)

[Source repository](https://github.com/salyra-ui/color-picker)

See THIRD_PARTY_NOTICES.md for attribution of the bundled color names.

## Production files

JavaScript runtime bundles and CSS are minified. The `styles.css` export loads `styles.min.css`, so existing imports work. Svelte, Vue and Astro retain their compiler inputs and type syntax with compact scripts. Declaration files remain readable. No sourcemaps are included.

Vanilla includes readable and minified browser bundles, `browser/color-picker.js` and `browser/color-picker.min.js`. The default ESM entry is minified. Import `/vanilla/standard` for the readable ESM entry, or `/styles.standard.css` for readable CSS.

## Migration

Replace `@sebytza23/color-picker-FRAMEWORK` with `@salyra-ui/color-picker/FRAMEWORK`. Replace the old core name with `@salyra-ui/color-picker`. Styles are exported by the base package as `/styles.min.css`, `/styles.css` and `/styles.standard.css`. Install the base package, not an import subpath.
