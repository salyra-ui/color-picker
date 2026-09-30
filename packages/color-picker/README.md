# @sebytza23/color-picker

Standalone, framework independent color math and composable color controls. No dependency on theme-kit. Runtime core has zero dependencies.

Entry points: `color-picker`, `/react`, `/svelte`, `/vue`, `/angular`, `/astro/*.astro`, `/styles.css`.

Primitives: ColorProvider, ColorArea, ColorSlider (h/s/v/alpha), ColorInput (separate RGB/HSL/HSV/OKLCH/OKLab channel fields or a single HEX field), ColorChannelInput, ColorFormatSelect, ColorMode, ColorSwatch, ColorPreview (all five adapters). All optional CSS can be replaced. The native sliders provide single-axis accessible controls; the two-dimensional area accepts arrows, Shift+arrows, Home/End and pointer/touch/pen input.

```svelte
<script>
  import {
    ColorProvider,
    ColorArea,
    ColorSlider,
    ColorInput,
    ColorFormatSelect,
    ColorMode,
  } from '@sebytza23/color-picker-svelte';
  import '@sebytza23/color-picker/styles.css';
</script>

<ColorProvider value="#6366f1" onChange={(hex) => console.log(hex)}>
  <ColorArea />
  <ColorSlider />
  <ColorFormatSelect />
  <ColorInput />
  <ColorMode />
</ColorProvider>
```

React uses `onChange`, Vue uses `@change`, Angular uses `(colorChange)`, Astro emits a bubbling `color-change` CustomEvent. Context hooks expose a stable store. `createColorStore()` is also usable without a UI framework. Supplied `store` is an initial option and must remain stable for a provider lifetime. Color `value` changes are synchronized without emitting duplicates for identical colors.

`ColorArea` computes HSV directly from pointer coordinates in constant memory; pointer events are coalesced into one update per animation frame. Hue is preserved through gray/black and controlled hex echoes do not reset saturation.

Astro components share their nearest `<cp-provider>` element. For matching static HTML, pass the initial `value` to `ColorArea`/`ColorInput` as well as the provider; children synchronize from context once JavaScript runs. If placed inside a framework island, keep that island's whole provider subtree together.

Build from workspace: `npm run build`. The distributable package is `packages/color-picker/dist`; `npm pack ./packages/color-picker/dist` creates a standalone tarball. The unscoped name is a local working name: choose an available npm scope before publishing.

OKLCH/OKLab are converted into sRGB with chroma reduction outside gamut. `ColorTextInput` is an optional full-string editor; `ColorInput` uses separate numeric fields for each non-HEX channel. `ColorFormatSelect` and `ColorMode` belong to this package and require only ColorProvider.

## Extended API

`getColor(hex)` returns the nearest NTC name, legacy slug, selected HEX, typed RGB/HSL/HSV/OKLCH/OKLab values and formatted channel strings. `getColorValue(hex, format)` and `store.getValue(format)` compute only the requested format. `store.getColor()` returns all values. Numeric perceptual lightness uses 0–1, HSL/HSV channels use percentages. `ColorWheel` edits hue/saturation; pair it with a brightness slider (`channel="v"`). See THIRD_PARTY_NOTICES.md for the NTC dataset attribution.

## Views, transparency and customization

`ColorSurface` follows `store.setView('area' | 'wheel')`, composing the rectangle with Hue or the wheel with Brightness. `ColorViewSelect` supplies the view switch. The wheel and its generic multi-marker interaction live entirely in **color-picker**.

Alpha is available in every adapter: compose `ColorSlider channel="alpha"` and/or `ColorAlphaInput`. The UI uses 0–100%; `store.setAlpha()` uses 0–1. `ColorProvider value` accepts #RGB, #RGBA, #RRGGBB and #RRGGBBAA. The returned HEX and change callbacks include the alpha byte when nonopaque. Each numeric RGB/HSL/HSV/OKLCH/OKLab result includes `alpha`; full formatted strings include `/ alpha`. Eight-bit HEX quantizes alpha; `store.getColor()`, `getValue()` and `getSnapshot().alpha` retain the numeric precision set via `setAlpha`. `snapshot.hex` is the opaque RGB base; `snapshot.value` is the RGBA result. Channel edits and surface changes preserve transparency. Naming ignores alpha. Theme palettes currently use opaque RGB bases.

```svelte
<script>
  import {
    ColorProvider,
    ColorWheel,
    ColorSlider,
    ColorInput,
    ColorAlphaInput,
    ColorViewSelect,
    ColorSurface,
  } from '@sebytza23/color-picker-svelte';
  import '@sebytza23/color-picker/styles.css';
</script>

<ColorProvider
  value="#6366F180"
  view="wheel"
  onChange={(rgba) => console.log(rgba)}
>
  <ColorViewSelect />
  <ColorSurface />
  <ColorSlider channel="alpha" classes={{ track: 'my-alpha-track' }} />
  <ColorAlphaInput classes={{ input: 'my-number-input' }} />
  <ColorInput />
</ColorProvider>
```

`ColorArea`, `ColorWheel`, `ColorSlider`, `ColorInput`, `ColorTextInput`, `ColorChannelInput` and `ColorAlphaInput` accept a `classes` object. Available parts are `root`, `thumb`, `marker`, `text`, `label`, `track`, `input`; each component uses the relevant parts. Root classes use `className` in React, `class` in Svelte/Astro, ordinary inherited `class` in Vue, and `[className]` in Angular. Vue root `style` is inherited; React/Svelte/Astro surfaces expose `style`. CSS can target stable `data-cp-part` attributes (`surface`, `thumb`, `thumb-text`, `marker`, `marker-text`, `slider`, `track`, `input`, `select`, `alpha-input`). Selectors work for custom styling of other primitives too. Angular styles targeting a child component should be global or use a consumer-owned copied component.

Decorative CSS variables: `--cp-wheel-size`, `--cp-wheel-background`, `--cp-thumb-size`, `--cp-thumb-radius`, `--cp-thumb-border`, `--cp-thumb-shadow`, `--cp-thumb-text-color`, `--cp-thumb-text-size`, `--cp-marker-size`, `--cp-marker-radius`, `--cp-marker-border`, `--cp-marker-shadow`, `--cp-marker-active-shadow`, `--cp-marker-text-color`, `--cp-marker-text-size`, `--cp-hue-gradient`, `--cp-track-height`, `--cp-track-radius`, `--cp-slider-thumb-size`. Set them on a surface or any ancestor. The default stylesheet is optional; copy the markup for a fully bespoke layout. Keep the controller's positioning and pointer behavior when replacing the layout.

`thumbText` changes the dot text. React also accepts `ColorArea renderThumb` and `ColorWheel renderMarker`; Svelte has a `thumb` snippet on ColorArea and a `marker` snippet on ColorWheel; Vue has `thumb` and scoped `marker` slots; Astro has a `thumb` slot. Angular ColorArea accepts projected `[cpThumb]` content. Marker labels are supplied by the caller and may be empty.

A `ColorWheel` can render arbitrary `ColorMarker[]` with `id`, `color: {h,s,v,hex}`, optional `label` and `ariaLabel`. Pair `markers` with `activeId` and handle selection/edits: React/Svelte `onSelect(id)` / `onMarkerChange(id, hsv)`; Vue `@select` / `@marker-change`; Angular `(markerSelect)` / `(markerChange)` (payload `{id,hsv}`); Astro `marker-select` / `marker-change` CustomEvents and `ColorWheelElement.setMarkers(markers, activeId)`. This supports multi-color wheels without depending on theme-kit. Wrap the wheel in ColorProvider. One marker or an empty label uses the small dot style.

## Independent adapters and vanilla output

Install only `@sebytza23/color-picker-react`, `-svelte`, `-vue`, `-angular`, `-astro`, or `-vanilla`. Each adapter re-exports core helpers and ships its own stylesheet. The core contains only color/state/DOM math helpers and naming data; other framework adapters are not installed.

`mountColorPicker(host, {value, format, view, onChange})` returns `{element, store, getColor, getValue, destroy}`. `onChange` receives `ColorInfo`: name, exact/matchedHex, alpha, hex, RGB/HSL/HSV/OKLCH/OKLab objects and formatted channel strings. `getValue('hsl')` requests only HSL. `<cp-output format="name|json">` renders output and bubbles a `color-values` event with the full result. Color names are nearest matches from the bundled color list.

HTML/PHP can load `browser/color-picker.js` and call `window.ColorPicker.mountColorPicker()`. htmx can swap declarative cp-* fragments without an initializer. Custom element disconnection removes subscriptions and drag handlers. Native/vanilla entry points require a DOM; import the core in server code.

The shared wheel fixes marker selection even when the framework publishes state asynchronously. Clicking or normal pointer jitter selects the marker without changing any color; dragging updates the clicked role. All adapters share this implementation.
