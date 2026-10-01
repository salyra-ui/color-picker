# @sebytza23/theme-kit

Theme generation and composition, depending on color-picker. Optional fetching and storage, scoped CSS, SSR-safe per-provider state, separate loading content and fallback theme.

Core package: `@sebytza23/theme-kit`. Independent adapters: `@sebytza23/theme-kit-react`, `-svelte`, `-vue`, `-angular`, `-astro`, `-vanilla`. Each adapter exports core helpers and its own `/styles.css`. Astro components use `@sebytza23/theme-kit-astro/*.astro`.

Core API: `generateTheme`, `generatePalette`, `createThemeStore`, `parseTheme`, `themeStyle`, `themeVariables`, `fromLegacyTheme`, `toLegacyTheme`, `browserStorage`.

```svelte
<script>
  import { generateTheme } from '@sebytza23/theme-kit';
  import {
    ThemeProvider,
    ThemeGenerator,
    ThemePalette,
  } from '@sebytza23/theme-kit-svelte';
  import '@sebytza23/color-picker/styles.css';
  import '@sebytza23/theme-kit/styles.css';
  const theme = generateTheme('#6366f1');
</script>

<ThemeProvider options={{ theme }}>
  <ThemeGenerator />
  <ThemePalette />
</ThemeProvider>
```

Supplying `theme` is instant and standalone: no fetch or storage is required. `fallbackTheme` is applied automatically if a configured loader throws, returns invalid data or times out. Loading components are independent of that theme.

Read the workspace README for SSR, client fetch, failure, custom loading, persistence and all framework examples. Options initialize the provider; use `useThemeStore().setTheme(theme)` for later changes or remount for a new loader/configuration. `loadTheme` is called only after mounting or on explicit `store.start()/reload()`.

`ThemeLoading` and `ThemeReady` accept arbitrary children. Ready includes fallback; `ThemeError` lets you expose a retry UI. ThemeGenerator is an optional composed example; combine color-picker primitives and `store.generate(hex)` to build your own controls. Angular consumers can compose their own `<cp-provider>` and connect `(colorChange)` to the theme store. CSS stays local to the provider's DOM subtree, including nested themes. Portals/teleports outside that subtree need their own provider/style variables.

Build independent packages with `npm run build:packages`. Publishable output is under `release/`; tarballs are produced by `npm run pack:all`. The theme core depends on `@sebytza23/color-picker`, and each native adapter depends only on matching adapters and cores. No packages have been published to npm.

Optional surfaces: `generateTheme(seed, {background:'tinted'})` or `store.setBackground('tinted')` adds primary tint to light/dark backgrounds. `ThemeBackground` exposes the switch; neutral is the generated default. Imported themes retain their original backgrounds until explicitly changed.

## Extended API

`ThemeColor role="primary|secondary|accent"` edits one palette; `wheel` enables the color wheel. `ThemeHarmony` selects analogous, triadic or split-complementary and generates the two companion colors on request. `ThemeRadius` / `ThemeBorderWidth` independently edit a target (DEFAULT, input, card, popover, button, table, picker). Width is px; radius is rem. All five adapters expose these components. The store provides setColor, setHarmony, generateHarmony and setBorder. `selectThemeTokens(theme, {roles:["primary"], radius:["card"]})` exports only selected CSS tokens; `generateThemeTokens(seed)` exports primary only. The complete theme retains three roles; legacy semantic roles are stripped.

## Composed picker views

`ThemePicker` adds three modes: `area`, `wheel`, `shared-wheel` (default). `roles` selects any nonempty subset of primary/secondary/accent; `activeRole` selects the initial editor. The role checkboxes and view selector are included in the default composition. Selection changes the shared brightness/format/channel editors without recoloring any palette. Edits change only the active role. One visible role uses a small anonymous dot; two/three roles have labeled markers. All wheel rendering and interactions come from `color-picker/ColorWheel`.

```svelte
<ThemeProvider options={{ theme }}>
  <ThemePicker view="shared-wheel" roles={['primary', 'secondary', 'accent']} />
</ThemeProvider>
```

React/Svelte/Vue use `ThemePicker`; Angular exposes `tk-picker` with `[roles]`, `activeRole`, `view`; Astro exports `ThemePicker.astro` (pass initial `theme` for matching SSR). `createThemePickerStore(themeStore, options)` provides independent formats, selection and retained HSV state per role. `mount()` subscribes to external theme changes and returns cleanup; adapters handle mounting automatically. `picker.activeColor` is a standard ColorStore, so arbitrary color-picker controls can edit the current role. React/Svelte/Vue may supply `picker` and replace the default controls via children/snippet/slot; Angular uses `[store]="picker"` and `[custom]="true"` with projected controls.

## Theme lists and configured output

`ThemeSelect themes={themes}` applies the chosen Theme to the nearest context. Lists can be replaced; IDs must be unique. A manually edited theme shows “Custom theme” until it exactly matches an entry again. An empty list disables the selector. The simple ThemeSwatch remains available for custom list layouts.

`ThemeExport` reads that same context. Its default output is JSON; `format="css"` displays CSS declarations. The typed configuration is `{theme, mode, tokens, css, json}`. A selection filters `theme`, JSON, CSS and tokens together. Mounted editor parts register their roles and geometry fields automatically on the client. Pass an explicit `selection` to the provider and export component for a matching partial server export. Restore a partial export with `store.setTheme(mergeThemeConfiguration(store.getSnapshot().theme, config.json))`. The complete internal context is available as `config.sourceTheme`. Without a selection or registered editor fields, the export contains the full theme.

```svelte
<script lang="ts">
  import {
    ThemeProvider,
    ThemePicker,
    ThemeSelect,
    ThemeExport,
  } from '@sebytza23/theme-kit-svelte';
  import { generateTheme, type ThemeConfiguration } from '@sebytza23/theme-kit';
  const themes = [generateTheme('#6366f1'), generateTheme('#ef6b52')];
  let configured = $state<ThemeConfiguration>();
</script>

<ThemeProvider options={{ theme: themes[0] }}>
  <ThemeSelect {themes} />
  <ThemePicker />
  <ThemeExport
    onChange={(value) => {
      configured = value;
    }}
  />
</ThemeProvider>
```

For custom output, React accepts `children(configuration)`, Svelte a children snippet, Vue a slot with `{configuration}`, Angular `[custom]="true"` with projected content and `(configurationChange)`, Astro custom slot content with a bubbling `configuration-change` CustomEvent. React/Svelte use `onChange`; Vue uses `@change`. Events run on the client and report the initial configuration and later changes. Astro's ThemeExportElement also exposes `.configuration`. Without components, call `themeConfiguration(store.getSnapshot(), selection?)` whenever needed. Angular selectors are `tk-select` / `tk-export`; Astro files are ThemeSelect.astro / ThemeExport.astro (pass initial theme/mode for matching SSR).

A top-level ThemeProvider shares state with all descendant ThemePicker/ThemeGenerator/ThemeSelect instances, regardless of layout depth. The closest nested provider defines a separate scope. Standalone ColorPicker controls connect through their change callback or the ThemePicker's activeColor store. CSS applies inside the provider's DOM subtree; independent framework islands and portals outside it require explicit store/style wiring.

## Cache freshness across applications

Storage and freshness are separate: browserStorage restores the last theme; a loader always revalidates on mount. An explicit server-rendered theme wins over old browser storage. `browserStorage(key)` now listens for changes in other same-origin tabs and applies valid themes without writing them back repeatedly. Removing the storage entry does not change the active theme.

```ts
import {
  browserStorage,
  createHttpThemeLoader,
  createThemeStore,
} from '@sebytza23/theme-kit';
const loadTheme = createHttpThemeLoader('/api/themes/current');
const options = {
  // Supply a server-loaded theme here for immediate SSR when available.
  loadTheme,
  storage: browserStorage('my-app:current-theme'),
  revalidateOnFocus: true,
  revalidateIntervalMs: 30_000, // optional
};
const store = createThemeStore(options);
// Pass options + store to a native ThemeProvider; it mounts and cleans up watchers.
```

The HTTP helper expects a Theme JSON body on 200. With ETag support, it sends If-None-Match and reuses the last validated theme on 304; a changed ETag/body replaces it. Normal 200-only endpoints work too. `.invalidate()` clears the helper's conditional cache. Each loader instance belongs to a provider/user/endpoint; do not share one singleton between SSR requests. The helper's memory cache does not persist across reloads; the browser HTTP cache and browserStorage provide reload caching. Cross-origin APIs must allow the conditional request header and expose ETag; authenticated APIs can supply headers/credentials via the helper options.

For immediate changes from another application, connect backend notifications:

```ts
import { watchThemeUpdates } from '@sebytza23/theme-kit';
const cleanup = watchThemeUpdates(store, {
  onFocus: true,
  subscribe(invalidate) {
    const events = new EventSource('/api/theme-events');
    events.addEventListener('theme-changed', invalidate);
    return () => events.close();
  },
});
// Call cleanup on component destruction; mount/start the store via the provider.
```

This is a client hook for your server's existing SSE/WebSocket protocol, not a bundled backend. Applications on different origins cannot share localStorage events; they must read a common authoritative API or receive its notifications. A backend can store themes in its database with a revision/updatedAt used as ETag. Redis is optional for server caching or distributing invalidation across server instances; when a theme is saved, invalidate that server cache and publish the revision notification. Redis itself does not update a browser's cached theme. Focus/interval refresh needs no realtime transport.

For React SSR, resolve remote data before constructing the store and initialize it with `{theme: resolvedTheme, mode}`. Its server snapshot is the immutable seed used for hydration. To render a configuration edited before SSR, construct a fresh store from `configuration.sourceTheme` and `configuration.mode`; client subscribers read the current live snapshot.

Protocol references: [ETag and conditional requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag), [same-origin storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event), [Redis Pub/Sub for backend invalidation](https://redis.io/docs/latest/develop/use-cases/pub-sub/).

## Three persisted color modes and custom names

The selected `modePreference` is `system`, `light` or `dark`; snapshot `mode` is always resolved to light/dark. System follows `matchMedia` only after browser mount, with a deterministic `systemMode` SSR seed. Default preference is system. Default persistence uses localStorage key `theme-kit:mode`; use `modeStorage: browserModeStorage('my-app:mode')` to isolate applications, or `modeStorage: false` to disable it. Same-origin tabs synchronize. Storage errors do not break the UI.

`ThemeMode value="dark"` renders a selectable mode button with custom children (React), snippet (Svelte), slot (Vue/Astro) or ng-template (Angular). Without value it cycles system → light → dark. `useThemeMode()` exposes preference, resolvedMode, setMode and cycle for your own buttons/select/toggle. Svelte exposes a subscribable store; Vue uses computed refs, Angular signals, React plain current values. Vanilla uses `themeModeActions(store)` and snapshot fields.

`ThemeName` proposes the nearest primary color name but accepts an arbitrary name (up to 200 characters). `store.setName('My theme')` locks the name across palette/generator edits; `store.setName()` resets to suggested naming. The optional `nameSource` metadata survives theme JSON/cache round trips. `generateTheme(seed, {name})` supplies a custom name. Configuration output includes the preference and resolved mode; JSON uses `{theme, mode: modePreference, systemMode}` for round trips.

## Independent adapters and vanilla HTML

Install `@sebytza23/theme-kit-react`, `-svelte`, `-vue`, `-angular`, `-astro`, or `-vanilla`. Each installs only its matching color adapter and core dependencies. Every adapter re-exports core helpers. Each adapter's `styles.css` includes the color controls' styles; one stylesheet import is enough. The core package contains no framework adapters.

The vanilla package exposes `mountThemeKit(host, options)`, returning `{element, store, getConfiguration, destroy}`. Or emit composable `tk-provider`, `tk-picker`, `tk-select`, `tk-export`, `cp-provider` and individual controls in HTML/PHP/htmx fragments. Custom elements connect on insertion and clean up on removal. The bundled `browser/theme-kit.js` creates `window.ThemeKit` and includes the color dependency. No npm runtime, framework or PHP extension is needed on the server.

See the workspace `docs.html`, `generator.html` and `site.html` for the complete documentation and studio. These package names are prepared but not yet published to npm.

## Shade swatches and disabled editors

`ThemePalette` shows shades 50 through 950 for a role. Set `shape` to `square`, `circle` or `joined`. `classes` targets `root`, `item`, `swatch` and `label`. `labels` maps a shade to custom text, and `shadeClasses` styles individual shade items. The colors remain connected to the theme. Customize spacing and dimensions with `--tk-palette-gap`, `--tk-swatch-height`, `--tk-swatch-radius` and `--tk-shade-label-size`. Vanilla exposes `themePaletteMarkup(role, options)`.

Pass `disabled: true` when creating the theme store or call `store.setDisabled(true)`. The provider blocks editing and keeps the current values visible. Programmatic updates remain available. Use a provider scoped to the editor if the rest of the application should stay interactive.

A selection can contain `roles`, `radius`, `width`, `background` and `modes`. Radius and width targets are independent. With no `modes`, background JSON includes the resolved active mode. Set `modes: ['light', 'dark']` to include both. Selected JSON is a partial theme, so merge it with an existing theme before passing it to a full-theme loader or storage adapter.

## Custom format buttons and disabled controls

`ColorMode` accepts custom content. React accepts children or a function receiving the current format. Svelte accepts a children snippet with the format. Vue exposes `format` through its slot. Angular accepts an `ng-template` whose implicit value is the format. Astro accepts slot content. In Astro and Vanilla, put `data-color-format` on an element to display the current format inside custom content. Vanilla uses `<cp-mode data-custom><button type="button">…</button></cp-mode>`.

Pass `disabled` to `ColorProvider` or `mountColorPicker`, or call `store.setDisabled(true)`. The disabled picker keeps its color and output visible, blocks pointer and keyboard editing, and still accepts programmatic updates. The core store supports an initial disabled state as the fourth `createColorStore(value, format, view, disabled)` argument.
