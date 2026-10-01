# @sebytza23/color-picker

Color conversions, named colors and picker state without a UI framework.

```bash
npm install @sebytza23/color-picker
```

```ts
import { createColorStore } from '@sebytza23/color-picker';

const store = createColorStore('#5268E080');
const color = store.getColor();
console.log(color.name, color.hex, color.rgb, color.hsl, color.formats);
store.setAlpha(0.5);
```

The store supports HEX, RGB, HSL, HSV, OKLCH and OKLab. Color names come from the bundled list and include an exact-match indicator. Each picker has independent state and can be initialized during server rendering.

For UI components, install one adapter: `@sebytza23/color-picker-react`, `-svelte`, `-vue`, `-angular`, `-astro` or `-vanilla`. Adapters re-export the core helpers and provide `styles.css`. Other framework adapters are not installed.

[Documentation and examples](https://sebytza23.github.io/color-picker/docs.html?kit=color-picker)

[Source repository](https://github.com/sebytza23/color-picker)

See THIRD_PARTY_NOTICES.md for attribution of the bundled color names.
