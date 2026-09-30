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
import { referenceTable } from './reference';
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
  app.innerHTML = `${nav}<main id="main"><section class="landing-hero"><div class="hero-copy"><p class="product-label">Composable UI for color & themes</p><h1>Color.<br>With controls.</h1><p class="lead">A standalone color picker. A theme editor built on top. Use native components, compose the parts, or connect the stores to your own interface.</p><div class="actions"><a class="button solid" href="${link('color.html')}">Explore color picker</a><a class="button" href="${link('generator.html')}">Explore theme kit</a></div></div><div class="hero-component"><div class="preview-label">Color picker <span>Interactive</span></div><div id="hero-picker"></div><div class="hero-color-result"><span id="hero-swatch"></span><div><strong id="hero-name"></strong><code id="hero-value"></code></div></div></div></section><div class="framework-strip"><span>Framework adapters</span>${integrations.map((i) => `<span>${i}</span>`).join('')}</div><section class="product-section"><div class="section-number">01</div><div><h2>Pick a color.</h2><p>Rectangle or wheel. Separate channels in six formats. Alpha, color names and controls you can customize independently.</p><a class="text-link" href="${link('color.html')}">View color picker examples</a></div><div class="format-index"><span>HEX</span><span>RGB</span><span>HSL</span><span>HSV</span><span>OKLCH</span><span>OKLab</span></div></section><section class="product-section"><div class="section-number">02</div><div><h2>Build a theme.</h2><p>Primary, secondary and accent. Generate a harmony or edit each role. Add tinted surfaces, radii and border widths only when you need them.</p><a class="text-link" href="${link('generator.html')}">View theme kit examples</a></div><div class="role-index"><span>Primary</span><span>Secondary</span><span>Accent</span></div></section><section class="landing-examples"><div class="section-heading"><h2>See the component.<br>Use the code.</h2><p>Each variation includes a working preview and an implementation for your framework.</p></div><div id="landing-explorer"></div></section><section class="feature-grid"><article><h3>Independent packages</h3><p>Install the adapter for your framework. The color picker has no theme-kit dependency.</p></article><article><h3>Shared context</h3><p>Place a provider above your components. Pickers, presets and output read the same store.</p></article><article><h3>Predictable rendering</h3><p>Supply a theme for an immediate render, or load one with custom loading content and a fallback.</p><a class="text-link" href="${link('generator.html#rendering')}">Try the rendering examples</a></article></section></main>${footer}`;
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
  app.innerHTML = `${nav}<main id="main" class="catalog-page"><header class="page-heading"><div><p class="product-label">${color ? 'Standalone color components' : 'Theme components & generator'}</p><h1>${color ? 'color<span>/</span>picker' : 'theme<span>/</span>kit'}</h1></div><div class="page-intro"><p>${color ? 'Edit a color in six formats. Choose a surface, compose the controls and read the name, channels and alpha from the same store.' : 'Edit primary, secondary and accent; generate their harmony; choose neutral or tinted backgrounds. Add radii and border widths to the CSS output as needed. Every example below has an independent store.'}</p><a class="text-link" href="${link('docs.html?kit=' + kit)}">${color ? 'Color picker' : 'Theme kit'} API & installation</a></div></header><section class="examples-section" aria-labelledby="examples-title"><div class="section-heading"><h2 id="examples-title">Component examples</h2><p>Choose a variation. Switch between preview and code, select your framework, then copy the implementation.</p></div><div id="kit-explorer"></div></section>${color ? `<section class="reference-band"><article><h3>One color, six formats</h3><p>HEX, RGB, HSL, HSV, OKLCH and OKLab. Each numeric channel has its own input. Changing a channel keeps the other values synchronized.</p></article><article><h3>Names & alpha</h3><p>The output includes a nearest color name and an exact-match flag. Alpha is available in the store, numeric input, slider and formatted values.</p></article><article><h3>Compose your controls</h3><p>Surface, sliders, inputs and format controls are independent. Use classes, CSS variables and custom thumb content to change their appearance. The Custom controls example lets you edit these settings and copy the result.</p></article></section>` : `<section id="rendering" class="examples-section"><div class="section-heading"><h2>Loading & fallback</h2><p>Run the same context through an immediate render, a successful request, a failed request or a timeout.</p></div><div id="rendering-lab"></div></section><section class="reference-band"><article><h3>Custom theme names</h3><p>A name is suggested from the primary color. A custom name is preserved while colors and geometry change.</p></article><article><h3>Only the tokens you need</h3><p>Choose roles and geometry targets with selectThemeTokens(), or pass a selection to ThemeExport. The complete theme remains available for saving. The sample application displays the full context even when the export is limited to primary.</p></article><article><h3>System, light & dark</h3><p>Persist the preference and resolve system changes after mount. Use the mode hook for your own buttons, toggle or dropdown.</p></article></section>`}<section class="install-section"><div><h2>Install ${color ? 'color picker' : 'theme kit'}</h2><p>Choose your framework adapter. Each adapter includes the color core and its stylesheet. Theme adapters also include the matching color picker adapter.</p><p class="release-note">npm publication is pending. You can use repository builds or the vanilla downloads today.</p></div><div id="installation"></div></section></main>${footer}`;
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
  app.innerHTML = `${nav}<div class="docs-layout"><aside class="docs-sidebar"><div class="docs-kit-tabs"><a ${color ? 'aria-current="page"' : ''} href="${link('docs.html?kit=color-picker')}">Color picker</a><a ${!color ? 'aria-current="page"' : ''} href="${link('docs.html?kit=theme-kit')}">Theme kit</a></div><nav aria-label="Documentation sections"><a href="#overview">Overview</a><a href="#installation">Installation</a><a href="#examples">Examples</a><a href="#composition">Composition</a><a href="#output">Output</a><a href="#customization">Customization</a>${color ? '' : `<a href="#rendering">Rendering & fallback</a><a href="#persistence">Persistence & freshness</a>`}<a href="#reference">API reference</a></nav></aside><main id="main" class="docs-content"><section id="overview"><p class="product-label">${color ? 'Color picker' : 'Theme kit'} documentation</p><h1>${color ? 'Color picker' : 'Theme kit'}</h1><p class="lead">${color ? 'Compose a single-color editor from a surface, sliders and channel inputs. Read every supported format from one store.' : 'Compose a theme editor around a shared context. Supply a theme directly, select a preset, or load a theme with a fallback.'}</p><div class="docs-callout">${color ? 'ColorProvider shares one selected color across its surfaces, sliders and inputs.' : 'Theme kit uses color picker for its color controls. Primary, secondary and accent belong to the theme context.'}</div></section><section id="installation"><h2>Installation</h2><p>Install only the adapter that matches your application.</p><div class="release-note">The packages are prepared under @sebytza23; the first npm release is pending. The command below applies once they are published.</div><div id="docs-installation"></div><p>The selected framework is a peer dependency. Adapters for other frameworks are not installed. ${color ? 'The core can also be used without a UI adapter.' : 'Theme adapters include the matching color picker adapter. Their stylesheet includes color picker styles.'}</p><div class="asset-downloads"><a class="button" href="${link('downloads/' + kit + '.js')}" download>Download vanilla JS</a><a class="button" href="${link('downloads/' + kit + '.css')}" download>Download CSS</a>${color ? '' : `<a class="button" href="${link('downloads/color-picker.css')}" download>Download color picker CSS</a>`}</div><p class="muted">The Vanilla build runs in the browser without a framework. Copy both downloads to your public assets directory; the HTML examples below use /assets/. For npm + a bundler, import the Vanilla module instead of adding the downloaded script.</p></section><section id="examples"><h2>Working examples</h2><p>Interact with the component here. The preview uses the native DOM adapter; source tabs show the equivalent framework composition.</p><div id="docs-explorer"></div></section><section id="composition"><h2>Composition</h2>${color ? `<p>Put ColorProvider above the controls that should share a color. Surfaces, sliders, inputs and format controls use the closest provider. A second provider creates a separate picker.</p><div class="docs-diagram"><strong>ColorProvider</strong><div><span>ColorArea / ColorWheel</span><span>ColorSlider</span><span>ColorInput</span><span>ColorFormatSelect / ColorMode</span></div></div><p>Use createColorStore() for programmatic updates and subscriptions. React, Svelte, Vue and Angular also expose useColorStore() and useColor() inside a child of ColorProvider. Vanilla and Astro use the native element’s store and bubbling DOM events.</p>` : `<p>Put ThemeProvider above your application. ThemePicker, ThemeSelect, ThemeName, ThemeMode and ThemeExport inside it read or update the same context. Nested providers create independent themes.</p><div class="docs-diagram"><strong>ThemeProvider</strong><div><span>ThemePicker</span><span>ThemeSelect</span><span>ThemeMode / useThemeMode()</span><span>ThemeExport</span><span>Application content</span></div></div><p>The provider scopes CSS variables to its subtree. Portalled content needs to stay in that scope or receive the theme variables explicitly.</p>`}<div id="composition-code"></div></section><section id="output"><h2>${color ? 'Names, formats & values' : 'Theme configuration & tokens'}</h2><p>${color ? 'getColor() returns a color name, the exact-match flag, numeric channels and strings for all six formats. getValue(format) returns the typed value for that format; use color.formats for formatted strings. Naming uses the bundled color list; a nearest match is not an exact color identity. RGB channels are 0–255; HSL/HSV use degrees and percentages. OKLCH/OKLab lightness is 0–1 in the typed output and 0–100% in the UI. HSV is a picker representation, not a CSS color function.' : 'themeConfiguration() returns the full theme, resolved mode, saved preference, tokens, CSS and round-trippable JSON. A token selection filters CSS output; JSON preserves the complete theme.'}</p><div id="output-code"></div></section><section id="customization"><h2>Customization</h2><p>${color ? 'Use classes on the surface and controls. The classes prop can target root, thumb, marker and text. Use thumbText for a label, or a render hook for custom thumb content.' : 'Compose only the controls you want. Mode buttons accept your own content; useThemeMode() lets you build a toggle, three buttons or a dropdown. ThemeName accepts a user-supplied name. Hooks must run in a child of the provider; wrapping a provider below a hook in the same component does not provide its context.'}</p><h3>Custom classes, labels and tracks</h3><p>Change the thumb text, control color or dimensions. The preview and copied CSS update together.</p><div id="custom-explorer"></div><h3>${color ? 'Styling variables' : 'Custom appearance buttons'}</h3><div id="custom-code"></div>${color ? `<table><thead><tr><th>CSS variable / selector</th><th>Controls</th></tr></thead><tbody><tr><td>--cp-thumb-size / --cp-thumb-radius</td><td>Single color dot size and shape</td></tr><tr><td>--cp-track-height / --cp-track-radius</td><td>Hue and alpha track geometry</td></tr><tr><td>--cp-hue-gradient</td><td>Hue bar background</td></tr><tr><td>[data-cp-part="surface"]</td><td>Picking surface</td></tr><tr><td>[data-cp-part="thumb-text"]</td><td>Thumb content</td></tr></tbody></table>` : ''}</section>${color ? '' : `<section id="rendering"><h2>Rendering & fallback</h2><p>A supplied theme renders immediately. With loadTheme() and no supplied or cached theme, the context exposes loading until the request settles. A supplied or cached theme stays visible during revalidation. A rejected, invalid or timed-out response applies fallbackTheme. ThemeLoading renders your own loading content; ThemeError provides an error and retry action. ThemeReady displays a successful or fallback theme.</p><div id="docs-rendering"></div><h3>Server rendering</h3><p>React, Svelte, Vue, Angular and Astro can render a seeded theme on the server. Vanilla DOM elements mount in the browser; its shared core can still prepare CSS on the server. Create one store per request and supply the resolved theme and mode. Use the same seed for client hydration. Browser storage and the OS preference are read after mount; supply a matching server seed to make the first render match a saved preference.</p><div id="ssr-code"></div></section><section id="persistence"><h2>Persistence & freshness</h2><p>browserStorage() saves the theme; browserModeStorage() saves the system/light/dark preference. An explicitly supplied theme takes priority over cached theme data. To restore a stored theme, supply a fallbackTheme and storage.</p><p>Cached data can render while the HTTP loader revalidates. ETag/304 responses avoid unnecessary replacement. Same-origin storage events synchronize browser tabs; focus, polling or watchThemeUpdates() can trigger revalidation after remote changes.</p><div id="cache-code"></div><h3>HTTP response</h3><p>The endpoint returns the Theme object, not the export wrapper. Send an ETag that changes with the theme revision. On a matching If-None-Match, return 304; otherwise return the updated theme JSON. Store invalidation and cross-app notifications belong to your server integration.</p><p>Redis is optional server infrastructure. The browser still needs an HTTP revision/ETag or a notification through SSE/WebSocket to know that a theme changed.</p></section>`}<section id="reference"><h2>API reference</h2>${referenceTable(kit)}<p>React uses className and render props; Svelte uses class and snippets; Vue uses class and slots; Angular uses class and templates. Astro components render HTML on the server and register the native client. Vanilla uses custom elements and DOM events. Core helpers are re-exported by every adapter.</p></section></main></div>${footer}`;
  installation(document.querySelector('#docs-installation')!, kit);
  cleanup.push(mountExplorer(document.querySelector('#docs-explorer')!, kit));
  cleanup.push(
    mountExplorer(document.querySelector('#custom-explorer')!, kit, 'custom'),
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
        : `import { createThemeStore, generateTheme, themeConfiguration,\n  selectThemeTokens } from '${pkg(i)}';\n\nconst store = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light' });\nconst config = themeConfiguration(store.getSnapshot(), {\n  roles: ['primary'], radius: ['card'], width: ['card'],\n});\nconfig.theme;         // full validated theme\nconfig.mode;          // resolved light/dark\nconfig.modePreference;// saved system/light/dark preference\nconfig.css;           // selected tokens as CSS declarations\nconfig.json;          // complete theme and mode for persistence\n\nconst tokens = selectThemeTokens(config.theme, { roles: ['primary'] });`,
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
