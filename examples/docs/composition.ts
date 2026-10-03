import {
  createColorStore,
  mountColorControls,
} from '@salyra-ui/color-picker/vanilla';
import {
  createThemeStore,
  generateTheme,
  mountThemeControls,
  bindThemeScope,
} from '@salyra-ui/theme-studio/vanilla';
import { codePanel } from './gallery';
import type { Integration, Kit } from './snippets';
import colorReact from '../composition/ColorReact.tsx?raw';
import colorSvelte from '../composition/ColorSvelte.svelte?raw';
import colorVue from '../composition/ColorVue.vue?raw';
import colorAngular from '../composition/ColorAngular.ts?raw';
import colorAstro from '../composition/ColorAstro.astro?raw';
import colorVanilla from '../composition/ColorVanilla.html?raw';
import themeReact from '../composition/ThemeReact.tsx?raw';
import themeSvelte from '../composition/ThemeSvelte.svelte?raw';
import themeVue from '../composition/ThemeVue.vue?raw';
import themeAngular from '../composition/ThemeAngular.ts?raw';
import themeAstro from '../composition/ThemeAstro.astro?raw';
import themeVanilla from '../composition/ThemeVanilla.html?raw';
import styles from '../composition/styles.css?raw';
import '../composition/styles.css';
const sources: Record<Kit, Record<Integration, string>> = {
  'color-picker': {
    React: colorReact,
    Svelte: colorSvelte,
    Vue: colorVue,
    Angular: colorAngular,
    Astro: colorAstro,
    Vanilla: colorVanilla,
  },
  'theme-studio': {
    React: themeReact,
    Svelte: themeSvelte,
    Vue: themeVue,
    Angular: themeAngular,
    Astro: themeAstro,
    Vanilla: themeVanilla,
  },
};
export function compositionFiles(kit: Kit, integration: Integration) {
  const suffix = {
    React: 'tsx',
    Svelte: 'svelte',
    Vue: 'vue',
    Angular: 'ts',
    Astro: 'astro',
    Vanilla: 'html',
  }[integration];
  const code = sources[kit][integration];
  return [
    {
      name: `${kit === 'color-picker' ? 'Color' : 'Theme'}Example.${suffix}`,
      code,
    },
    { name: 'styles.css', code: styles },
    {
      name: 'README.md',
      code: `# Composable ${kit}\n\nThis example uses the v1 composition API.\n\nKeep styles.css next to the example and import it in your application entry. The example styles are local to .composition-editor.\n\n${integration === 'Vanilla' ? 'Download ' + kit + '.min.js from the documentation downloads and place it at /assets/' + kit + '.min.js. The standard .js build has the same API. No framework or default stylesheet is required.' : 'Install @salyra-ui/' + kit + ' and your framework. Import styles.css once. ThemePalette and ThemeExport are ready-made presets and use @salyra-ui/theme-studio/styles.min.css. Astro receives explicit value/theme seeds for its server-rendered controls.'}\n`,
    },
  ];
}
export function mountCompositionExample(host: HTMLElement, kit: Kit) {
  const id = `composition-${kit}`;
  host.innerHTML = `<div class="composition-example" data-example="composition"><div class="example-toolbar"><div class="view-tabs" role="tablist" aria-label="Composition view"><button type="button" role="tab" aria-selected="true" data-composition-view="preview" aria-controls="${id}-preview">Preview</button><button type="button" role="tab" aria-selected="false" data-composition-view="code" aria-controls="${id}-code">Code</button></div></div><div id="${id}-preview" role="tabpanel" data-preview></div><div id="${id}-code" role="tabpanel" data-code hidden></div></div>`;
  const preview = host.querySelector<HTMLElement>('[data-preview]')!,
    code = host.querySelector<HTMLElement>('[data-code]')!;
  codePanel(code, (integration) => sources[kit][integration], {
    label: 'Composable controls',
    files: (integration) => compositionFiles(kit, integration),
    downloadName: () => kit + '-composition',
  });
  // Use the exact markup shipped in the Vanilla example, with no manufactured labels or controls.
  const html = new DOMParser().parseFromString(
    sources[kit].Vanilla,
    'text/html',
  );
  html.querySelectorAll('script').forEach((script) => script.remove());
  preview.append(...Array.from(html.body.children));
  const root = preview.firstElementChild as HTMLElement,
    stops: (() => void)[] = [];
  if (kit === 'color-picker') {
    const store = createColorStore('#5268E080'),
      controls = mountColorControls(root, store);
    const render = () => {
      root.querySelector('output')!.textContent = store.getSnapshot().value;
    };
    render();
    stops.push(store.subscribe(render), controls.destroy);
  } else {
    const store = createThemeStore({
        theme: generateTheme('#5268E0'),
        mode: 'dark',
        modeStorage: false,
      }),
      scope = bindThemeScope(root, store),
      controls = mountThemeControls(root, store, {
        roles: ['primary', 'accent'],
      });
    const render = () => {
      root.querySelector('[data-configuration]')!.textContent =
        controls.getConfiguration().json;
    };
    render();
    stops.push(store.subscribe(render), controls.destroy, scope);
  }
  const viewTabs = host.querySelectorAll<HTMLButtonElement>(
    '.example-toolbar button[data-composition-view]',
  );
  viewTabs.forEach((button) =>
    button.addEventListener('click', () => {
      const show = button.dataset.compositionView === 'preview';
      preview.hidden = !show;
      code.hidden = show;
      viewTabs.forEach((tab) =>
        tab.setAttribute('aria-selected', String(tab === button)),
      );
    }),
  );
  return () => {
    stops.reverse().forEach((stop) => stop());
    host.replaceChildren();
  };
}
