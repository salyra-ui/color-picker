/// <reference types="vite/client" />
import '@sebytza23/color-picker/styles.css';
import '@sebytza23/theme-kit/styles.css';
import './site.css';
import {
  createColorStore,
  type ColorProviderElement,
} from '@sebytza23/color-picker-vanilla';
import {
  integrations,
  colorMarkup,
  modeExample,
  packageFor,
  type Kit,
} from './snippets';
import { referenceTable, mountReference } from './reference';
import { mountExplorer, mountRenderingLab, codePanel, escape } from './gallery';
const app = document.querySelector<HTMLDivElement>('#app')!;
const page = document.body.dataset.page ?? 'docs';
const base = import.meta.env.BASE_URL;
const link = (file: string) => `${base}${file}`;
const brand = `<a class="brand" href="${link('site.html')}" aria-label="Theme kit home">theme<span>/</span>kit<span class="brand-dot" aria-hidden="true"></span></a>`;
const nav = `<a class="skip-link" href="#main">Skip to content</a><header class="site-nav">${brand}<nav aria-label="Main navigation"><a ${page === 'color' ? 'aria-current="page"' : ''} href="${link('color.html')}">Color picker</a><a ${page === 'generator' ? 'aria-current="page"' : ''} href="${link('generator.html')}">Theme kit</a><a ${page === 'docs' ? 'aria-current="page"' : ''} href="${link('docs.html')}">Documentation</a><a href="https://github.com/sebytza23/theme-kit">GitHub</a></nav></header>`;
const footer = `<footer>${brand}<span>Color picker & theme kit</span><div><a href="https://github.com/sebytza23/color-picker">Color picker source</a><a href="https://github.com/sebytza23/theme-kit">Theme kit source</a></div></footer>`;
const cleanup: (() => void)[] = [];
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) cleanup.forEach((fn) => fn());
});
if (page === 'landing') {
  app.innerHTML = `${nav}<main id="main"><section class="landing-hero"><div class="hero-copy"><p class="product-label">Composable UI for color & themes</p><h1>Color.<br>With controls.</h1><p class="lead">Pick colors and build themes with controls that fit your application. Use a complete editor or choose the components you need.</p><div class="actions"><a class="button solid" href="${link('color.html')}">Explore color picker</a><a class="button" href="${link('generator.html')}">Explore theme kit</a></div></div><div class="hero-component"><div class="preview-label">Color picker <span>Interactive</span></div><div id="hero-picker"></div><div class="hero-color-result"><span id="hero-swatch"></span><div><strong id="hero-name"></strong><code id="hero-value"></code></div></div></div></section><div class="framework-strip"><span>Framework adapters</span>${integrations.map((i) => `<span>${i}</span>`).join('')}</div><section class="product-section"><div class="section-number">01</div><div><h2>Pick a color.</h2><p>Choose a rectangle or a wheel, enter channel values and adjust opacity. Every change gives you the color name and values in all six formats.</p><a class="text-link" href="${link('color.html')}">View color picker examples</a></div><div class="format-index"><span>HEX</span><span>RGB</span><span>HSL</span><span>HSV</span><span>OKLCH</span><span>OKLab</span></div></section><section class="product-section"><div class="section-number">02</div><div><h2>Build a theme.</h2><p>Start with primary, then add secondary and accent if you need them. Choose the radius, borders and backgrounds your editor will control.</p><a class="text-link" href="${link('generator.html')}">View theme kit examples</a></div><div class="role-index"><span>Primary</span><span>Secondary</span><span>Accent</span></div></section><section class="landing-examples"><div class="section-heading"><h2>See the component.<br>Use the code.</h2><p>Try an example, choose your framework and copy its code.</p></div><div id="landing-explorer"></div></section><section class="feature-grid"><article><h3>Independent packages</h3><p>Each framework has its own adapter. Installing color picker does not install theme kit.</p></article><article><h3>Shared context</h3><p>Put the provider around your application so editors, preset lists and theme output can use the same state.</p></article><article><h3>Predictable rendering</h3><p>Pass a theme to render it immediately. If you load it from an API, choose what appears while loading and which theme to use if the request fails.</p><a class="text-link" href="${link('generator.html#rendering')}">Try the rendering examples</a></article></section></main>${footer}`;
  const host = document.querySelector('#hero-picker')!;
  host.innerHTML = colorMarkup('rectangle');
  const store = createColorStore('#5268E0');
  const provider = host.querySelector<ColorProviderElement>('cp-provider')!;
  provider.setStore(store);
  // A deliberately small composition: surface, hue and channel fields only.
  provider.querySelector('cp-slider[channel="alpha"]')!.remove();
  provider.querySelector('cp-alpha-input')!.remove();
  provider.querySelector('cp-mode')!.remove();
  const update = () => {
    const color = store.getColor();
    document.querySelector<HTMLElement>('#hero-swatch')!.style.background =
      color.hex;
    document.querySelector('#hero-name')!.textContent = color.name;
    document.querySelector('#hero-value')!.textContent = color.hex;
  };
  provider.addEventListener('color-change', update);
  update();
  cleanup.push(
    mountExplorer(
      document.querySelector('#landing-explorer')!,
      'color-picker',
      'wheel',
    ),
  );
} else if (page === 'color' || page === 'generator') {
  const color = page === 'color',
    kit: Kit = color ? 'color-picker' : 'theme-kit';
  app.innerHTML = `${nav}<main id="main" class="catalog-page"><header class="page-heading"><div><p class="product-label">${color ? 'Standalone color components' : 'Theme components & generator'}</p><h1>${color ? 'color<span>/</span>picker' : 'theme<span>/</span>kit'}</h1></div><div class="page-intro"><p>${color ? 'Use the rectangle, wheel or channel inputs to choose a color. Each example includes opacity controls and returns the color name and values in six formats.' : 'Build an editor for the colors and dimensions your application uses. Try primary on its own, edit three colors together or choose individual radius and border fields.'}</p><a class="text-link" href="${link('docs.html?kit=' + kit)}">${color ? 'Color picker' : 'Theme kit'} API & installation</a></div></header><section class="examples-section" aria-labelledby="examples-title"><div class="section-heading"><h2 id="examples-title">Component examples</h2><p>Try each layout in the preview. Open Code to choose a framework and copy the component and its styles.</p></div><div id="kit-explorer"></div></section>${color ? `<section class="reference-band"><article><h3>One color, six formats</h3><p>Each numeric channel has its own input. Switch formats to read the same color as HEX, RGB, HSL, HSV, OKLCH or OKLab.</p></article><article><h3>Names & alpha</h3><p>Read the nearest name from the bundled color list and check whether it is an exact match. Set opacity with a slider, a numeric input or the store.</p></article><article><h3>Compose your controls</h3><p>Add only the controls your layout needs. In Custom controls, change the dot text, colors and sizes, then copy the component and updated CSS.</p></article></section>` : `<section id="rendering" class="examples-section"><div class="section-heading"><h2>Loading & fallback</h2><p>See what appears when a theme is supplied directly, loads successfully, fails to load or times out.</p></div><div id="rendering-lab"></div></section><section class="reference-band"><article><h3>Custom theme names</h3><p>The primary color provides a suggested name. Enter your own name and it stays the same as you edit the theme.</p></article><article><h3>Only the tokens you need</h3><p>JSON and CSS include the selected colors and fields. Primary only exports primary. Radius & borders lets you choose individual fields and one or both appearance modes.</p></article><article><h3>System, light & dark</h3><p>Choose system, light or dark and keep that preference after a refresh. Use the mode hook if you want to build your own buttons or dropdown.</p></article></section>`}<section class="install-section"><div><h2>Install ${color ? 'color picker' : 'theme kit'}</h2><p>Choose your framework adapter. ${color ? 'It includes the color core and stylesheet. It does not depend on theme kit.' : 'It includes the theme core, the matching color picker adapter and the component styles.'}</p></div><div id="installation"></div></section></main>${footer}`;
  cleanup.push(mountExplorer(document.querySelector('#kit-explorer')!, kit));
  if (!color)
    cleanup.push(mountRenderingLab(document.querySelector('#rendering-lab')!));
  installation(document.querySelector('#installation')!, kit);
} else {
  const kit: Kit =
    new URLSearchParams(location.search).get('kit') === 'theme-kit'
      ? 'theme-kit'
      : 'color-picker';
  const color = kit === 'color-picker';
  app.innerHTML = `${nav}<div class="docs-layout"><aside class="docs-sidebar"><div class="docs-kit-tabs"><a ${color ? 'aria-current="page"' : ''} href="${link('docs.html?kit=color-picker')}">Color picker</a><a ${!color ? 'aria-current="page"' : ''} href="${link('docs.html?kit=theme-kit')}">Theme kit</a></div><nav aria-label="Documentation sections"><a href="#overview">Overview</a><a href="#installation">Installation</a><a href="#examples">Examples</a><a href="#composition">Composition</a><a href="#output">Output</a><a href="#customization">Customization</a>${color ? '' : `<a href="#rendering">Rendering & fallback</a><a href="#persistence">Persistence & freshness</a>`}<a href="#reference">API reference</a></nav></aside><main id="main" class="docs-content"><section id="overview"><p class="product-label">${color ? 'Color picker' : 'Theme kit'} documentation</p><h1>${color ? 'Color picker' : 'Theme kit'}</h1><p class="lead">${color ? 'Build a color editor with a rectangle or wheel, sliders and separate channel inputs. The store gives you the selected color in every supported format.' : 'Set up a shared theme context, then add the editors and controls your application needs. You can supply a theme, choose a preset or load one from an API.'}</p><div class="docs-callout">${color ? 'ColorProvider shares one selected color across its surfaces, sliders and inputs.' : 'Theme kit uses color picker for its color controls. Primary, secondary and accent belong to the theme context.'}</div></section><section id="installation"><h2>Installation</h2><p>Install only the adapter that matches your application.</p><div id="docs-installation"></div><p>The selected framework is a peer dependency. Adapters for other frameworks are not installed. ${color ? 'The core can also be used without a UI adapter.' : 'Theme adapters include the matching color picker adapter. Their stylesheet includes color picker styles.'}</p><div class="asset-downloads"><a class="button" href="${link('downloads/' + kit + '.js')}" download>Download vanilla JS</a><a class="button" href="${link('downloads/' + kit + '.css')}" download>Download CSS</a>${color ? '' : `<a class="button" href="${link('downloads/color-picker.css')}" download>Download color picker CSS</a>`}</div><p class="muted">The Vanilla build runs without a framework. Copy the downloads to your public assets directory. The examples use /assets/. With a bundler, import the Vanilla module instead of loading the downloaded script.</p></section><section id="examples"><h2>Working examples</h2><p>Choose a layout and try its controls. Open Code for the implementation in your framework. For labels, classes and styling, see <a href="#customization">Customization</a>.</p><div id="docs-explorer"></div></section><section id="composition"><h2>Composition</h2>${color ? `<p>Put ColorProvider above the controls that should share a color. Surfaces, sliders, inputs and format controls use the closest provider. A second provider creates a separate picker.</p><div class="docs-diagram"><strong>ColorProvider</strong><div><span>ColorArea / ColorWheel</span><span>ColorSlider</span><span>ColorInput</span><span>ColorFormatSelect / ColorMode</span></div></div><p>Use createColorStore() for programmatic updates and subscriptions. React, Svelte, Vue and Angular also expose useColorStore() and useColor() inside a child of ColorProvider. Vanilla and Astro use the native element’s store and bubbling DOM events.</p>` : `<p>Put ThemeProvider above your application. ThemePicker, ThemeSelect, ThemeName, ThemeMode and ThemeExport inside it read or update the same context. Nested providers create independent themes.</p><div class="docs-diagram"><strong>ThemeProvider</strong><div><span>ThemePicker</span><span>ThemeSelect</span><span>ThemeMode / useThemeMode()</span><span>ThemeExport</span><span>Application content</span></div></div><p>The provider scopes CSS variables to its subtree. Portalled content needs to stay in that scope or receive the theme variables explicitly.</p>`}<div id="composition-code"></div></section><section id="output"><h2>${color ? 'Names, formats & values' : 'Theme configuration & tokens'}</h2><p>${color ? 'Call getColor() to read the name, match status, channels and formatted strings. Use getValue(format) for numeric values in a specific format, or color.formats for a string ready to display. RGB uses 0–255. HSL and HSV use degrees and percentages. OKLCH and OKLab lightness uses 0–1 in the store and 0–100% in the inputs. HSV describes the picker color and is not a CSS color function.' : 'Pass a selection to themeConfiguration() or ThemeExport to get only the colors and dimensions your editor handles. Mounted editor components register their color and geometry fields automatically. An explicit selection takes priority and also seeds the server export. The same selection applies to theme, JSON and CSS. Backgrounds include only the active appearance unless you explicitly select both modes. Use mergeThemeConfiguration() to apply a partial export to an existing theme.'}</p><div id="output-code"></div></section><section id="customization"><h2>Customization</h2><p>${color ? 'Use classes on the surface and controls. The classes prop can target root, thumb, marker and text. Use thumbText for a label, or a render hook for custom thumb content.' : 'Add the controls you need and give them your own labels or classes. ThemeMode accepts custom content, and useThemeMode() lets you build buttons or a dropdown. Call context hooks in a child of ThemeProvider so they can access its store.'}</p><h3>${color ? 'Labels, classes and controls' : 'Labels, classes and swatches'}</h3><p>Edit the labels and dimensions, then copy the updated component and CSS.</p><div id="custom-explorer"></div><h3>${color ? 'Styling variables' : 'Custom appearance buttons'}</h3><div id="custom-code"></div>${color ? `<table><thead><tr><th>CSS variable / selector</th><th>Controls</th></tr></thead><tbody><tr><td>--cp-thumb-size / --cp-thumb-radius</td><td>Single color dot size and shape</td></tr><tr><td>--cp-track-height / --cp-track-radius</td><td>Hue and alpha track geometry</td></tr><tr><td>--cp-hue-gradient</td><td>Hue bar background</td></tr><tr><td>[data-cp-part="surface"]</td><td>Picking surface</td></tr><tr><td>[data-cp-part="thumb-text"]</td><td>Thumb content</td></tr></tbody></table>` : ''}</section>${color ? '' : `<section id="rendering"><h2>Rendering & fallback</h2><p>A supplied theme renders immediately. If no theme is available, ThemeLoading shows your content while loadTheme() runs. A rejected request, invalid response or timeout applies fallbackTheme. ThemeReady displays the loaded or fallback theme, and ThemeError lets you show a retry action. During revalidation, the current theme stays visible.</p><div id="docs-rendering"></div><h3>Server rendering</h3><p>For server rendering, create a store for each request and supply the theme and resolved mode. Use those same values when hydrating the client. Supply selection on the provider and ThemeExport when the server must return a partial configuration. React, Svelte, Vue, Angular and Astro support this setup. Vanilla elements mount in the browser, while their core can generate CSS on the server. Browser storage and the system preference are read after mount.</p><div id="ssr-code"></div></section><section id="persistence"><h2>Persistence & freshness</h2><p>Use browserStorage() to save the full context and browserModeStorage() to save the appearance preference. A supplied theme takes priority over the browser cache. To restore a cached theme on startup, pass storage and a fallbackTheme.</p><p>A cached theme can appear while the loader checks for an update. The HTTP loader supports ETag and 304 responses. Storage events update other tabs on the same origin. Use focus revalidation, polling or watchThemeUpdates() when changes can come from another application.</p><div id="cache-code"></div><h3>HTTP response</h3><p>Return a full Theme object from the endpoint. Send an ETag that changes whenever the theme changes. Return 304 when If-None-Match matches that revision, or return the updated theme otherwise. For partial editor exports, merge them into the stored theme before returning it to the loader.</p><p>Redis is optional server infrastructure. The browser still needs an HTTP revision/ETag or a notification through SSE/WebSocket to know that a theme changed.</p></section>`}<section id="reference"><h2>API reference</h2>${referenceTable(kit)}</section></main></div>${footer}`;
  cleanup.push(mountReference(document.querySelector('#reference')!, kit));
  installation(document.querySelector('#docs-installation')!, kit);
  cleanup.push(mountExplorer(document.querySelector('#docs-explorer')!, kit, undefined, 'examples'));
  cleanup.push(
    mountExplorer(document.querySelector('#custom-explorer')!, kit, 'custom', 'customization'),
  );
  const pkg = (_i: (typeof integrations)[number]) => `@sebytza23/${kit}`;
  codePanel(
    document.querySelector('#composition-code')!,
    (i) =>
      color
        ? `import { createColorStore } from '${pkg(i)}';\n\nconst store = createColorStore('#5268E080', 'rgb');\nstore.setHex('#277D59');\nstore.setHSV({ h: 140 });\nstore.setAlpha(0.5);\nconst unsubscribe = store.subscribe(() => console.log(store.getColor()));\n// unsubscribe() when the consumer is removed.`
        : `import { createThemeStore, generateTheme } from '${pkg(i)}';\n\nconst store = createThemeStore({\n  theme: generateTheme('#5268E0'),\n  mode: 'system', systemMode: 'light',\n});\nstore.setColor('primary', '#277D59');\nstore.setName('Project theme');\nstore.setBorder('radius', 'card', 0.75);\nstore.setMode('dark');`,
    { label: 'Store updates', file: 'store.ts' },
  );
  codePanel(
    document.querySelector('#output-code')!,
    (i) =>
      color
        ? `import { createColorStore } from '${pkg(i)}';\nconst store = createColorStore('#5268E080');\nconst color = store.getColor();\n\ncolor.name;        // nearest name from the bundled list\ncolor.exact;       // true only for an exact named match\ncolor.hex;         // #RRGGBB or #RRGGBBAA\ncolor.rgb;         // { r, g, b, alpha }\ncolor.hsl;         // { h, s, l, alpha }\ncolor.hsv;         // { h, s, v, alpha }\ncolor.oklch;       // { l, c, h, alpha }\ncolor.oklab;       // { l, a, b, alpha }\ncolor.formats;     // strings for all supported formats\nstore.getValue('hsl');`
        : `import { createThemeStore, generateTheme, themeConfiguration,\n  mergeThemeConfiguration } from '${pkg(i)}';\n\nconst store = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light' });\nconst config = themeConfiguration(store.getSnapshot(), {\n  roles: ['primary'], radius: ['card'], width: ['button'],\n});\nconfig.theme;         // primary palette and the two selected fields\nconfig.mode;          // resolved light/dark\nconfig.modePreference;// saved system/light/dark preference\nconfig.css;           // selected tokens as CSS declarations\nconfig.json;          // the same selected fields as JSON\n\nconst updated = mergeThemeConfiguration(store.getSnapshot().theme, config.json);\nstore.setTheme(updated);`,
    { label: 'Read values', file: 'output.ts' },
  );
  codePanel(
    document.querySelector('#custom-code')!,
    (i) =>
      color
        ? `.custom-picker {\n  --cp-thumb-size: 22px;\n  --cp-thumb-radius: 0;\n  --cp-thumb-border: 2px solid white;\n  --cp-track-height: 12px;\n  --cp-track-radius: 0;\n}\n.custom-picker [data-cp-part="thumb-text"] { font-size: 10px; }`
        : modeExample(i),
    color
      ? { label: 'Styles', file: 'styles.css' }
      : { label: 'Appearance controls', baseName: 'AppearanceControls' },
  );
  if (!color) {
    cleanup.push(mountRenderingLab(document.querySelector('#docs-rendering')!));
    codePanel(
      document.querySelector('#ssr-code')!,
      () =>
        `import { createThemeStore, generateTheme, themeConfiguration } from '@sebytza23/theme-kit';

// Call once per request with the user's theme and saved mode.
export function createThemeSeed() {
  const store = createThemeStore({
    theme: generateTheme('#5268E0'), mode: 'dark', systemMode: 'dark',
    modeStorage: false,
  });
  const { theme, modePreference: mode, systemMode } = store.getServerSnapshot();
  return { options: { theme, mode, systemMode },
    css: themeConfiguration(store.getServerSnapshot()).css };
}

// Pass seed.options to the server and client provider.
// Use seed.css as inline declarations for a server-rendered scope.`,
      { label: 'Server seed', file: 'theme-seed.ts' },
    );
    codePanel(
      document.querySelector('#cache-code')!,
      (i) =>
        `import { createThemeStore, browserStorage, browserModeStorage,\n  generateTheme, createHttpThemeLoader } from '${pkg(i)}';\n\nconst options = {\n  fallbackTheme: generateTheme('#5268E0'),\n  storage: browserStorage('app:theme'),\n  modeStorage: browserModeStorage('app:mode'),\n  loadTheme: createHttpThemeLoader('/api/theme'),\n  revalidateOnFocus: true,\n  revalidateIntervalMs: 60000,\n};\nconst store = createThemeStore(options);\n// Pass options/store to the framework provider.\n// Native DOM consumers call mountThemeStore(store, options.storage, options).`,
      { label: 'Cache configuration', file: 'theme-options.ts' },
    );
  }
}
function installation(host: HTMLElement, kit: Kit) {
  codePanel(host, () => '', {
    label: 'Installation',
    files: (i) => [
      { name: 'Terminal', code: `npm install ${packageFor(kit, i)}` },
      {
        name: i === 'Angular' ? 'styles.css' : 'Global styles',
        code:
          i === 'Angular'
            ? `@import '${packageFor(kit, i)}/styles.css';`
            : `import '${packageFor(kit, i)}/styles.css';`,
      },
      ...(i === 'Vanilla'
        ? [
            {
              name: 'Downloaded assets',
              code: `<link rel="stylesheet" href="/assets/${kit}.css">${kit === 'theme-kit' ? '\n<link rel="stylesheet" href="/assets/color-picker.css">' : ''}\n<script src="/assets/${kit}.js"></script>`,
            },
          ]
        : []),
    ],
  });
}
