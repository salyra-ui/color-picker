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

## V1 composition

Version 1.0.0 separates context and behavior from your editor markup. The examples below use the published composition API.

A root owns state and context. It does not render a wrapper or load a stylesheet. Each part renders one native control and forwards its HTML attributes. Put labels, spacing, icons and any extra content in your own markup.

```tsx
import { ColorPicker } from '@salyra-ui/color-picker/react';
import './color-editor.css';

<ColorPicker.Root defaultValue="#5268E080">
  <ColorPicker.Wheel className="color-wheel">
    <ColorPicker.Thumb className="color-thumb">Pick</ColorPicker.Thumb>
  </ColorPicker.Wheel>
  <label>
    Opacity
    <ColorPicker.Slider channel="alpha" className="color-slider" />
  </label>
  <ColorPicker.ChannelInput format="rgb" index={0} aria-label="Red" />
  <ColorPicker.ChannelInput format="rgb" index={1} aria-label="Green" />
  <ColorPicker.ChannelInput format="rgb" index={2} aria-label="Blue" />
  <ColorPicker.Input className="color-value" />
  <ColorPicker.FormatTrigger>Change format</ColorPicker.FormatTrigger>
</ColorPicker.Root>;
```

Use `Area` instead of `Wheel` for a rectangular surface. Give an area a width and height in your CSS. A wheel needs a width and keeps a square aspect ratio. Thumb positioning follows the selected color, while its size, shape and content come from your classes. Sliders use native range inputs.

React, Svelte and Vue export the `ColorPicker` composition object and individual parts. React supports `ref` and `onValueChange`, Svelte supports `bind:ref` and `bind:value`, and Vue supports `v-model` and exposes the native element. Angular uses directives such as `cpRoot`, `cpWheel`, `cpThumb`, `cpSlider` and `cpInput` on your own HTML. Astro components are imported individually, such as `/astro/ColorRoot.astro`.

For plain HTML, connect existing controls with `mountColorControls(root, store)`. Add `data-cp-control="wheel"`, `"slider"`, `"input"` or `"format"` to the controls, and use `data-channel`, `data-format` and `data-index` for their options. Call the returned `destroy()` when removing the editor. The wheel thumb uses `data-cp-part="thumb"`.

Incomplete input stays in the focused field. Valid edits update the store. Blur, Enter and Escape restore the current valid value when the draft is invalid. `disabled` on the root disables its controls, while a disabled individual control stays disabled when the context is enabled again.

The composition API needs no default stylesheet. Ready-made controls such as `ColorArea`, `ColorWheel` and `ColorInput` remain available as styled compositions and use the optional package CSS. For extensive visual changes, build a local composition from the primitives instead of overriding preset internals.

[Full examples for all six integrations](https://salyra-ui.github.io/color-picker/docs.html?kit=color-picker#composition)

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

## Version 1

![Custom v1 color-picker composition](https://salyra-ui.github.io/color-picker/npm/color-picker-composition.jpg)

Use `ColorPicker.Root` and its primitives for a custom layout. `ColorProvider` and the styled controls remain available for ready-made editors. Root supplies state without a wrapper, while surfaces, native inputs and format triggers accept your attributes, classes and content. Custom compositions do not require the package stylesheet.

## Migration

Replace `@sebytza23/color-picker-FRAMEWORK` with `@salyra-ui/color-picker/FRAMEWORK`. Replace the old core name with `@salyra-ui/color-picker`. Styles are exported by the base package as `/styles.min.css`, `/styles.css` and `/styles.standard.css`. Install the base package, not an import subpath.

## Forms, history and saved colors

All framework entries re-export these helpers. Create stores per component or server request. Browser bindings begin on mount.

```ts
import {
  createColorStore,
  createColorHistory,
  mountHistory,
  bindColorForm,
  createColorCollection,
  browserColorStorage,
  colorContrast,
} from '@salyra-ui/color-picker';

const store = createColorStore('#5268E080');
const history = createColorHistory(store, { limit: 50 });
const collection = createColorCollection({
  storage: browserColorStorage('app:colors'),
});

// On client mount, with the picker inside this form:
const field = bindColorForm(form, store, { name: 'brandColor', format: 'hex' });
const detach = mountHistory(form, history);
collection.load();

// Explicit actions. Avoid saving every drag sample as a recent color.
collection.remember(store.getSnapshot().value);
collection.toggleFavorite(store.getSnapshot().value);
history.undo();
history.redo();
console.log(colorContrast(store.getSnapshot().value, '#FFFFFF'));

// On unmount:
field.destroy();
detach();
history.destroy();
```

`bindColorForm` accepts `name`, `format`, `required`, `disabled`, `defaultValue` and `validate(value)`. It adds one native form control, excludes disabled values and restores the starting color on reset. `validate` returns an error message or `undefined`. The return value exposes `input`, `getValue()` and `destroy()`.

History captures color and alpha. Format, surface and disabled changes do not add steps. `begin()` and `end()` group setters into one step. `mountHistory` groups pointer gestures and text edits, supports Ctrl/Cmd+Z outside editable fields and returns a cleanup function. History retains at most `limit` undo steps.

`ColorCollection` is available in React, Svelte, Vue and Angular. Pass `collection`, `kind="recent|favorites"`, `label` and `classes={{root,item,label}}`. Astro accepts serializable `colors` and exposes `cp-collection.setCollection(collection)` on the client. Vanilla uses `mountColorCollection(host, store, collection, options)` and returns a destroy method. The list contains colors only, without theme roles.

`colorContrast(foreground, background, {canvas, text})` composites alpha over an opaque canvas, then returns `ratio`, `aa`, `aaa`, rendered colors and `suggestedForeground`. The default canvas is white. `text` is `normal` or `large`. The helper never changes the selected color. Its pass/fail result checks color contrast only.

[Complete examples for all six integrations](https://salyra-ui.github.io/color-picker/color.html)

## Control styling

The optional stylesheet uses inherited variables such as `--cp-control-height`, `--cp-control-radius`, `--cp-control-border`, `--cp-focus-color`, `--cp-area-height` and `--cp-gap`. Set them on your picker wrapper to keep styles local. Existing thumb, marker and track variables still work. Number fields retain arrow-key editing while hiding native spinner buttons. Saturation and brightness tracks follow the current HSV color, including retained hue for black and gray.
