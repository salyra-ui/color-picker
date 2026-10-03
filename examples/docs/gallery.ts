import { mountColorPopover } from './color-popover';
import { mountEditingLab, mountColorFormLab } from './labs';
import { recipeFiles } from './recipes';
import { downloadSources } from './download';
import { sourceFiles } from './code-files';
import {
  createColorStore,
  type ColorProviderElement,
  type ColorInfo,
} from '@salyra-ui/color-picker/vanilla';
import {
  mountThemeKit,
  createThemeStore,
  mountThemeStore,
  themeConfiguration,
  generateTheme,
  browserModeStorage,
  type ThemeProviderElement,
  type ThemeOptions,
  type ThemeConfiguration,
  type TokenSelection,
  targets,
  themePaletteMarkup,
} from '@salyra-ui/theme-studio/vanilla';
import {
  integrations,
  colorVariants,
  themeVariants,
  colorMarkup,
  colorExample,
  themeExample,
  themeExampleSelection,
  paletteExample,
  paletteStyle,
  defaultSwatch,
  type SwatchSettings,
  renderingExample,
  customThemeMarkup,
  defaultCustom,
  type CustomSettings,
  type Kit,
  type Integration,
  type ColorVariant,
  type ThemeVariant,
} from './snippets';
export const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
let panelSequence = 0;
export function codePanel(
  host: HTMLElement,
  getCode: (integration: Integration) => string,
  options: {
    label?: string;
    integration?: Integration;
    file?: string;
    baseName?: string;
    downloadName?: () => string;
    files?: (integration: Integration) => { name: string; code: string }[];
  } = {},
) {
  let current = options.integration ?? 'React';
  let selectedFile = 0;
  let files: { name: string; code: string }[] = [];
  const id = `source-${++panelSequence}`;
  host.classList.add('code-panel');
  host.innerHTML = `<div class="code-toolbar"><div class="framework-tabs" role="tablist" aria-label="${escape(options.label ?? 'Example')} framework" ${options.file ? 'hidden' : ''}>${integrations.map((i) => `<button type="button" role="tab" id="${id}-${i}" aria-controls="${id}-code" data-framework="${i}">${i}</button>`).join('')}</div><span class="fixed-source-file" ${options.file ? '' : 'hidden'}>${escape(options.file ?? '')}</span><div class="code-actions"><button type="button" class="download-button" aria-label="Download files" title="Download all example files as a ZIP"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download files</span></button><button type="button" class="copy-button">Copy code</button></div></div><div class="source-file-tabs" role="tablist" aria-label="${escape(options.label ?? 'Example')} files"></div><pre id="${id}-code" role="tabpanel" tabindex="0"><code></code></pre><p class="copy-status" aria-live="polite"></p>`;
  const code = host.querySelector('code')!;
  const button = host.querySelector<HTMLButtonElement>('.copy-button')!;
  const status = host.querySelector('.copy-status')!;
  const fileTabs = host.querySelector<HTMLElement>('.source-file-tabs')!;
  const frameworkTabs = host.querySelector<HTMLElement>('.framework-tabs')!;
  const displayFile = () => {
    code.textContent = files[selectedFile].code;
    fileTabs.querySelectorAll<HTMLButtonElement>('[data-file]').forEach((b) => {
      const selected = Number(b.dataset.file) === selectedFile;
      b.setAttribute('aria-selected', String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    status.textContent = '';
    button.textContent = 'Copy code';
  };
  const update = () => {
    const previousFile = files[selectedFile]?.name;
    files =
      options.files?.(current) ??
      (options.file
        ? [{ name: options.file, code: getCode(current) }]
        : sourceFiles(getCode(current), current, options.baseName));
    selectedFile = Math.max(
      0,
      files.findIndex((f) => f.name === previousFile),
    );
    fileTabs.innerHTML = files
      .map(
        (f, i) =>
          `<button type="button" role="tab" aria-controls="${id}-code" data-file="${i}">${escape(f.name)}</button>`,
      )
      .join('');
    fileTabs.hidden = Boolean(options.file) && files.length === 1;
    frameworkTabs
      .querySelectorAll<HTMLButtonElement>('[data-framework]')
      .forEach((b) => {
        const selected = b.dataset.framework === current;
        b.setAttribute('aria-selected', String(selected));
        b.tabIndex = selected ? 0 : -1;
      });
    if (!options.file)
      host
        .querySelector('pre')!
        .setAttribute('aria-labelledby', `${id}-${current}`);
    displayFile();
  };
  frameworkTabs.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-framework]',
    );
    if (tab) {
      current = tab.dataset.framework as Integration;
      update();
    }
  });
  fileTabs.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-file]',
    );
    if (tab) {
      selectedFile = Number(tab.dataset.file);
      displayFile();
    }
  });
  for (const tabs of [frameworkTabs, fileTabs])
    tabs.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      const buttons = [...tabs.querySelectorAll<HTMLButtonElement>('button')];
      const index = buttons.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (index < 0) return;
      e.preventDefault();
      const next =
        e.key === 'Home'
          ? 0
          : e.key === 'End'
            ? buttons.length - 1
            : (index + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) %
              buttons.length;
      buttons[next].click();
      buttons[next].focus();
    });
  host
    .querySelector('.download-button')!
    .addEventListener('click', () =>
      downloadSources(
        files,
        options.downloadName?.() ??
          (options.baseName ?? 'example') +
            (options.file ? '' : '-' + current.toLowerCase()),
      ),
    );
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      status.textContent = 'Code copied.';
      button.textContent = 'Copied';
    } catch {
      status.textContent = 'Select the code and copy it with your keyboard.';
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });
  update();
  return {
    refresh: update,
    setIntegration(i: Integration) {
      current = i;
      update();
    },
  };
}
export function sampleMarkup(
  roles: readonly string[] = ['primary', 'secondary', 'accent'],
) {
  return `<div class="theme-sample"><div class="sample-header"><span>Application preview</span><span data-sample-mode></span></div><article class="sample-card"><span class="sample-name" data-sample-name></span><h3>Project settings</h3><p>Buttons, inputs and surfaces use the active theme tokens.</p><label>Project name<input value="Website redesign" aria-label="Example project name"></label><div class="sample-actions"><button class="sample-primary" type="button">Save changes</button><button class="sample-secondary" type="button">Cancel</button></div>${roles.includes('accent') ? '<div class="sample-note">Accent surface</div>' : ''}</article><div class="sample-colors">${roles.map((r) => `<span style="--role:var(--${r})"><i></i>${r}</span>`).join('')}</div></div>`;
}
export function updateSample(host: HTMLElement, config: ThemeConfiguration) {
  host.style.cssText = config.css;
  host.querySelector('[data-sample-name]')!.textContent = config.theme.name;
  host.querySelector('[data-sample-mode]')!.textContent =
    config.modePreference === 'system'
      ? `System / ${config.mode}`
      : config.mode;
}
function colorReadout(host: HTMLElement, color: ColorInfo) {
  host.querySelector<HTMLElement>(
    '[data-color-swatch]',
  )!.style.backgroundColor = color.hex;
  host.querySelector('[data-color-name]')!.textContent = color.name;
  host.querySelector('[data-color-match]')!.textContent = color.exact
    ? 'Exact named color'
    : 'Nearest named color';
  host.querySelector('[data-color-hex]')!.textContent = color.hex;
  const values = host.querySelector('[data-color-values]')!;
  values.innerHTML = Object.entries(color.formats)
    .map(
      ([format, value]) =>
        `<div><dt>${format.toUpperCase()}</dt><dd>${escape(value)}</dd></div>`,
    )
    .join('');
}
export function mountExplorer(
  host: HTMLElement,
  kit: Kit,
  initial?: ColorVariant | ThemeVariant,
  section: 'all' | 'examples' | 'customization' = 'all',
) {
  const isColor = kit === 'color-picker',
    variants = (isColor ? colorVariants : themeVariants).filter(({ id }) => {
      const customizable = id === 'custom' || id === 'palette';
      return (
        section === 'all' ||
        (section === 'customization' ? customizable : !customizable)
      );
    });
  let variant = variants.find(({ id }) => id === initial)?.id ?? variants[0].id,
    cleanup: (() => void) | undefined,
    cleanupCustomization: (() => void) | undefined;
  let custom: CustomSettings = {
    ...defaultCustom,
    ...(isColor ? {} : { text: 'B', size: 26 }),
  };
  let swatchSettings: SwatchSettings = { ...defaultSwatch };
  let geometrySelection: TokenSelection = {
    ...themeExampleSelection('geometry'),
    modes: ['light'],
  };
  host.classList.add('explorer');
  host.innerHTML = `<div class="example-toolbar">${variants.length === 1 ? `<span class="example-select">${escape(variants[0].title)}</span>` : `<label class="example-select">${section === 'customization' ? 'Customize' : 'Example'}<select data-example aria-label="${isColor ? 'Color picker' : 'Theme studio'} ${section === 'customization' ? 'customization' : 'example'}">${variants.map((v) => `<option value="${v.id}" ${v.id === variant ? 'selected' : ''}>${escape(v.title)}</option>`).join('')}</select></label>`}<div class="view-tabs" role="group" aria-label="Example display"><button type="button" data-display="preview" aria-pressed="true">Preview</button><button type="button" data-display="code" aria-pressed="false">Code</button></div></div><div class="example-description"><p></p></div><div class="example-body" data-display="preview"><div class="example-preview"><div class="preview-label">Interactive preview <span>Vanilla adapter</span></div><div class="preview-content"></div></div><div class="example-code"></div></div>`;
  const body = host.querySelector<HTMLElement>('.example-body')!,
    content = host.querySelector<HTMLElement>('.preview-content')!,
    description = host.querySelector('.example-description p')!,
    exampleSelect = host.querySelector<HTMLSelectElement>('[data-example]');
  const panel = codePanel(
    host.querySelector('.example-code')!,
    (i) =>
      isColor
        ? colorExample(i, variant as ColorVariant, custom)
        : variant === 'palette'
          ? paletteExample(i, swatchSettings)
          : themeExample(
              i,
              variant as ThemeVariant,
              custom,
              variant === 'geometry'
                ? geometrySelection
                : themeExampleSelection(variant as ThemeVariant),
            ),
    {
      label: isColor ? 'Color picker' : 'Theme editor',
      baseName: isColor ? 'ColorPicker' : 'ThemeEditor',
      files: (i) =>
        variant === 'editing' || variant === 'form'
          ? recipeFiles(kit, i)
          : sourceFiles(
              isColor
                ? colorExample(i, variant as ColorVariant, custom)
                : variant === 'palette'
                  ? paletteExample(i, swatchSettings)
                  : themeExample(
                      i,
                      variant as ThemeVariant,
                      custom,
                      variant === 'geometry'
                        ? geometrySelection
                        : themeExampleSelection(variant as ThemeVariant),
                    ),
              i,
              isColor ? 'ColorPicker' : 'ThemeEditor',
            ),
    },
  );
  const show = () => {
    cleanup?.();
    cleanupCustomization?.();
    cleanupCustomization = undefined;
    content.replaceChildren();
    if (exampleSelect) exampleSelect.value = variant;
    description.textContent = variants.find(
      (v) => v.id === variant,
    )!.description;
    if (variant === 'editing') {
      cleanup = mountEditingLab(content);
    } else if (variant === 'form') {
      cleanup = mountColorFormLab(content);
    } else if (isColor) {
      content.innerHTML = `<div class="color-demo">${colorMarkup(variant as ColorVariant)}<div class="color-result"><div class="swatch-checker"><div data-color-swatch></div></div><div><h3 data-color-name></h3><p data-color-match></p><code data-color-hex></code></div></div></div><details class="color-values"><summary>All color values</summary><dl data-color-values></dl></details>`;
      if (variant === 'custom') {
        const form = customizationForm(custom, () => applyCustomization());
        content.prepend(form);
        cleanupCustomization = form.destroy;
      }
      const store = createColorStore(
        '#5268E080',
        variant === 'channels' ? 'rgb' : 'hex',
        'area',
        variant === 'disabled',
      );
      const provider = content.querySelector<ColorProviderElement>(
        '.color-demo cp-provider',
      )!;
      provider.setStore(store);
      const update = () => colorReadout(content, store.getColor());
      provider.addEventListener('color-change', update);
      update();
      cleanup = () => {
        provider.removeEventListener('color-change', update);
        provider.remove();
      };
    } else if (variant === 'palette') {
      content.innerHTML = `<form class="swatch-settings"><label>Swatch shape<select data-swatch-shape><option value="square">Squares</option><option value="circle">Circles</option><option value="joined">Joined strip</option></select></label><label>500 shade label<input data-swatch-label maxlength="40"></label><label>Gap (px)<input type="number" data-swatch-gap min="0" max="24"></label><label>Height (px)<input type="number" data-swatch-size min="24" max="96"></label></form><div class="palette-example"></div>`;
      const target = content.querySelector<HTMLElement>('.palette-example')!;
      const options: ThemeOptions = {
        theme: generateTheme('#5268E0'),
        modeStorage: false,
      };
      const provider = document.createElement(
        'tk-provider',
      ) as ThemeProviderElement;
      provider.setStore(createThemeStore(options), options);
      const render = () => {
        provider.innerHTML = themePaletteMarkup('primary', {
          shape: swatchSettings.shape,
          classes: {
            root: 'brand-palette',
            label: 'brand-shade-label',
            swatch: 'brand-shade',
          },
          labels: { 500: swatchSettings.label },
        });
        const style = document.createElement('style');
        style.textContent = paletteStyle(swatchSettings)
          .replaceAll(
            '.brand-palette',
            `.explorer-${panelSequence} .brand-palette`,
          )
          .replaceAll(
            '.brand-shade-label',
            `.explorer-${panelSequence} .brand-shade-label`,
          )
          .replaceAll(
            '.brand-shade {',
            `.explorer-${panelSequence} .brand-shade {`,
          );
        provider.className = `explorer-${panelSequence}`;
        provider.append(style);
        panel.refresh();
      };
      target.append(provider);
      const shape = content.querySelector<HTMLSelectElement>(
          '[data-swatch-shape]',
        )!,
        label = content.querySelector<HTMLInputElement>('[data-swatch-label]')!,
        gap = content.querySelector<HTMLInputElement>('[data-swatch-gap]')!,
        size = content.querySelector<HTMLInputElement>('[data-swatch-size]')!;
      shape.value = swatchSettings.shape;
      label.value = swatchSettings.label;
      gap.value = String(swatchSettings.gap);
      size.value = String(swatchSettings.size);
      content
        .querySelector('form')!
        .addEventListener('submit', (event) => event.preventDefault());
      content.querySelector('form')!.addEventListener('input', () => {
        if (!gap.validity.valid || !size.validity.valid) return;
        swatchSettings = {
          shape: shape.value as SwatchSettings['shape'],
          label: label.value,
          gap: gap.valueAsNumber,
          size: size.valueAsNumber,
        };
        render();
      });
      render();
      cleanup = () => provider.remove();
    } else {
      content.innerHTML = `<div class="theme-demo"><div class="theme-controls"></div><div class="sample-host">${sampleMarkup(themeExampleSelection(variant as ThemeVariant).roles)}</div></div><details class="configuration"><summary>Generated configuration</summary><div class="output-actions"><label>Format<select data-output-format aria-label="Configuration format"><option value="json">JSON</option><option value="css">CSS</option><option value="tailwind">Tailwind CSS</option></select></label><button type="button" data-copy-output>Copy output</button><button type="button" data-download>Download</button></div><pre tabindex="0"></pre><p data-output-status aria-live="polite"></p></details>`;
      const sample = content.querySelector<HTMLElement>('.sample-host')!,
        output = content.querySelector('pre')!,
        controls = content.querySelector<HTMLElement>('.theme-controls')!;
      const themes = [
        generateTheme('#5268E0', { name: 'Indigo' }),
        generateTheme('#277D59', { name: 'Forest' }),
        generateTheme('#C25D3D', { name: 'Terracotta' }),
      ];
      let json = '';
      let css = '';
      let tailwind = '';
      const format = content.querySelector<HTMLSelectElement>(
        '[data-output-format]',
      )!;
      format.value = 'json';
      const renderOutput = () => {
        output.textContent =
          format.value === 'tailwind'
            ? tailwind
            : format.value === 'css'
              ? css
              : json;
      };
      format.addEventListener('change', renderOutput);
      const changed = (config: ThemeConfiguration) => {
        updateSample(sample, themeConfiguration(mountedStore(config)));
        json = config.json;
        tailwind = config.tailwind;
        css = `:root {\n${Object.entries(config.tokens)
          .map(([name, value]) => `  ${name}: ${value};`)
          .join('\n')}\n}`;
        renderOutput();
      };
      if (variant === 'custom') {
        const form = customizationForm(custom, () => applyCustomization());
        content.prepend(form);
        cleanupCustomization = form.destroy;
        const options: ThemeOptions = {
          theme: themes[0],
          mode: 'system',
          modeStorage: false,
        };
        const store = createThemeStore(options),
          provider = document.createElement(
            'tk-provider',
          ) as ThemeProviderElement;
        provider.setStore(store, options);
        provider.innerHTML = customThemeMarkup();
        const cp = provider.querySelector('cp-provider')!;
        cp.setAttribute('value', '#5268E0');
        controls.append(provider);
        const unsub = store.subscribe(() =>
          changed(
            themeConfiguration(store.getSnapshot(), { roles: ['primary'] }),
          ),
        );
        changed(
          themeConfiguration(store.getSnapshot(), { roles: ['primary'] }),
        );
        cleanup = () => {
          unsub();
          provider.remove();
        };
      } else if (variant === 'presets') {
        const options: ThemeOptions = {
          theme: themes[0],
          mode: 'system',
          modeStorage: browserModeStorage('docs:theme-mode'),
        };
        const store = createThemeStore(options),
          provider = document.createElement(
            'tk-provider',
          ) as ThemeProviderElement;
        provider.setStore(store, options);
        const list = document.createElement('tk-select');
        list.dataset.themes = JSON.stringify(themes);
        list.innerHTML = `<label class="cp-format">Theme<select>${themes.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}</select></label>`;
        provider.append(list);
        const modes = document.createElement('div');
        modes.className = 'mode-buttons';
        modes.innerHTML = ['system', 'light', 'dark']
          .map(
            (m) =>
              `<button type="button" data-tk-mode="${m}">${m[0].toUpperCase() + m.slice(1)}</button>`,
          )
          .join('');
        provider.append(modes);
        provider.insertAdjacentHTML(
          'beforeend',
          `<section class="generated-palettes"><h3>Generated shades</h3>${['primary', 'secondary', 'accent'].map((role) => `<h4>${role}</h4>${themePaletteMarkup(role as 'primary', { shape: 'joined' })}`).join('')}</section>`,
        );
        controls.append(provider);
        const unsub = store.subscribe(() =>
          changed(themeConfiguration(store.getSnapshot())),
        );
        changed(themeConfiguration(store.getSnapshot()));
        cleanup = () => {
          unsub();
          provider.remove();
        };
      } else {
        const selection =
          variant === 'geometry'
            ? geometrySelection
            : themeExampleSelection(variant as ThemeVariant);
        let currentStore = createThemeStore({
          theme: themes[0],
          disabled: variant === 'disabled',
          mode: selection.modes?.[0] ?? 'light',
          modeStorage: false,
          selection,
        });
        let mounted: ReturnType<typeof mountThemeKit>;
        const renderEditor = () => {
          mounted?.destroy();
          const configured =
            variant === 'geometry' ? geometrySelection : selection;
          currentStore.setSelection(configured);
          if (configured.modes?.length === 1)
            currentStore.setMode(configured.modes[0]);
          mounted = mountThemeKit(controls, {
            store: currentStore,
            selection: configured,
            theme: themes[0],
            themes,
            modeStorage: false,
            disabled: variant === 'disabled',
            radius: configured.radius ?? [],
            width: configured.width ?? [],
            backgroundControl: !!configured.background,
            picker: {
              view:
                variant === 'rectangle' || variant === 'geometry'
                  ? 'area'
                  : variant === 'single'
                    ? 'wheel'
                    : 'shared-wheel',
              roles: configured.roles,
              controls: false,
            },
            onChange: changed,
          });
          if (variant === 'single' || variant === 'geometry') {
            mounted.element.querySelector('tk-select')?.remove();
            mounted.element.querySelector('.tk-harmony')?.remove();
          }
          if (variant === 'single' || configured.modes?.length === 1)
            mounted.element
              .querySelector('[aria-label="Theme mode"]')
              ?.remove();
          mounted.element.querySelector('details')?.remove();
          const palette = document.createElement('section');
          palette.className = 'generated-palettes';
          palette.innerHTML = `<h3>Generated shades</h3>${(configured.roles ?? ['primary']).map((role) => `<h4>${role[0].toUpperCase() + role.slice(1)}</h4>${themePaletteMarkup(role, { shape: 'joined' })}`).join('')}`;
          mounted.element.append(palette);
          changed(mounted.getConfiguration());
        };
        if (variant === 'geometry') {
          const form = document.createElement('div');
          form.className = 'geometry-config';
          form.innerHTML = `<fieldset><legend>Fields included in this editor</legend><table><thead><tr><th>Target</th><th>Radius <small>rem</small></th><th>Border width <small>px</small></th></tr></thead><tbody>${targets.map((target) => `<tr><th scope="row">${target === 'DEFAULT' ? 'Default' : target[0].toUpperCase() + target.slice(1)}</th>${(['radius', 'width'] as const).map((kind) => `<td><input type="checkbox" data-geometry="${kind}" data-target="${target}" aria-label="Include ${target} ${kind}" ${geometrySelection[kind]?.includes(target) ? 'checked' : ''}></td>`).join('')}</tr>`).join('')}</tbody></table></fieldset><fieldset class="geometry-modes"><legend>Appearance included in the export</legend>${['light', 'dark'].map((mode) => `<label><input type="checkbox" data-export-mode="${mode}" ${geometrySelection.modes?.includes(mode as 'light' | 'dark') ? 'checked' : ''}>${mode === 'light' ? 'Light' : 'Dark'}</label>`).join('')}<label><input type="checkbox" data-export-background ${geometrySelection.background ? 'checked' : ''}>Background and foreground</label></fieldset>`;
          form.addEventListener('change', () => {
            const modes = [
              ...form.querySelectorAll<HTMLInputElement>(
                '[data-export-mode]:checked',
              ),
            ].map((el) => el.dataset.exportMode as 'light' | 'dark');
            if (!modes.length) {
              form.querySelector<HTMLInputElement>(
                `[data-export-mode="${geometrySelection.modes?.[0] ?? 'light'}"]`,
              )!.checked = true;
              return;
            }
            geometrySelection = {
              roles: ['primary'],
              radius: [
                ...form.querySelectorAll<HTMLInputElement>(
                  '[data-geometry="radius"]:checked',
                ),
              ].map((el) => el.dataset.target as (typeof targets)[number]),
              width: [
                ...form.querySelectorAll<HTMLInputElement>(
                  '[data-geometry="width"]:checked',
                ),
              ].map((el) => el.dataset.target as (typeof targets)[number]),
              modes,
              background: form.querySelector<HTMLInputElement>(
                '[data-export-background]',
              )!.checked,
            };
            renderEditor();
            panel.refresh();
          });
          content.prepend(form);
        }
        renderEditor();
        cleanup = () => mounted.destroy();
      }
      content
        .querySelector('[data-copy-output]')!
        .addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(
              format.value === 'tailwind'
                ? tailwind
                : format.value === 'css'
                  ? css
                  : json,
            );
            content.querySelector('[data-output-status]')!.textContent =
              `${format.value.toUpperCase()} copied.`;
          } catch {
            content.querySelector('[data-output-status]')!.textContent =
              'Select the output and copy it with your keyboard.';
          }
        });
      content
        .querySelector('[data-download]')!
        .addEventListener('click', () =>
          download(
            format.value === 'tailwind'
              ? tailwind
              : format.value === 'css'
                ? css
                : json,
            format.value === 'tailwind'
              ? 'theme.tailwind.css'
              : format.value === 'css'
                ? 'theme.css'
                : 'theme.json',
          ),
        );
    }
    if (variant === 'custom') applyCustomization();
    panel.refresh();
  };
  function applyCustomization() {
    const target = content.querySelector<HTMLElement>(
      '.custom-picker,.custom-theme',
    );
    if (!target) return;
    target.style.setProperty('--cp-controls-color', custom.color);
    target.style.setProperty('--cp-thumb-size', custom.size + 'px');
    target.style.setProperty('--cp-track-height', custom.track + 'px');
    target.querySelector<HTMLElement>(
      '[data-cp-part=thumb-text]',
    )!.textContent = custom.text;
    panel.refresh();
  }
  exampleSelect?.addEventListener('change', () => {
    variant = exampleSelect.value as typeof variant;
    show();
  });
  host
    .querySelectorAll<HTMLButtonElement>('.view-tabs button[data-display]')
    .forEach((b) =>
      b.addEventListener('click', () => {
        body.dataset.display = b.dataset.display;
        host
          .querySelectorAll<HTMLButtonElement>('.view-tabs button')
          .forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
      }),
    );
  show();
  return () => {
    cleanup?.();
    cleanupCustomization?.();
  };
}
function mountedStore(
  config: ThemeConfiguration,
): import('@salyra-ui/theme-studio').ThemeSnapshot {
  return {
    theme: config.sourceTheme,
    disabled: false,
    mode: config.mode,
    modePreference: config.modePreference,
    systemMode: config.systemMode,
    status: 'ready',
    pending: false,
    error: null,
    background: config.sourceTheme.backgroundMode ?? 'preserve',
    style: config.css,
  };
}
export function download(value: string, name: string) {
  const url = URL.createObjectURL(
      new Blob([value], { type: 'application/json' }),
    ),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export function mountRenderingLab(host: HTMLElement) {
  host.classList.add('rendering-lab');
  host.innerHTML = `<div class="lab-controls" role="group" aria-label="Rendering scenario"><button data-scenario="standalone" aria-pressed="true">Standalone</button><button data-scenario="success" aria-pressed="false">Fetch success</button><button data-scenario="failure" aria-pressed="false">Fetch error</button><button data-scenario="timeout" aria-pressed="false">Timeout</button></div><div class="lab-description"><p data-lab-description></p><p class="muted" data-lab-request-note>The preview simulates a request locally. The source uses /api/theme. Return a Theme object as JSON. HTTP errors, invalid theme data and timeouts apply the fallback.</p></div><div class="view-tabs lab-view-tabs" role="group" aria-label="Loading example display"><button type="button" data-lab-display="preview" aria-pressed="true">Preview</button><button type="button" data-lab-display="code" aria-pressed="false">Code</button></div><div class="lab-grid" data-lab-display="preview"><div class="lab-preview"><div class="request-status" role="status"><span data-status></span><span data-lab-name></span></div><div data-lab-loading class="loading-example" hidden><div class="loading-bar"></div><h3>Loading theme</h3><p>This area is custom loading content.</p></div><div data-lab-content>${sampleMarkup()}</div><div class="error-example" data-lab-error hidden><p></p><button type="button" data-retry>Retry successfully</button></div><div class="lab-replay"><button type="button" data-replay>Run again</button><span data-lab-mode></span></div></div><div data-lab-code></div></div>`;
  let stop: (() => void) | undefined,
    unsubscribe: (() => void) | undefined,
    active = 'standalone',
    retrySuccess = false;
  const panel = codePanel(
    host.querySelector('[data-lab-code]')!,
    (i) => renderingExample(i, active),
    {
      label: 'Theme loading',
      baseName: 'ThemeLoadingExample',
    },
  );
  const descriptions: Record<string, string> = {
    standalone:
      'A supplied theme is ready immediately. No fetch and no loading screen.',
    success:
      'Show custom loading content, then apply the returned theme after 1.2 seconds.',
    failure:
      'A failed request applies the Indigo fallback. The error and retry control remain available.',
    timeout:
      'A request that never resolves is cancelled after 2 seconds. The fallback is applied automatically.',
  };
  const run = () => {
    unsubscribe?.();
    stop?.();
    retrySuccess = false;
    panel.refresh();
    host
      .querySelectorAll<HTMLButtonElement>('[data-scenario]')
      .forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.scenario === active)),
      );
    host.querySelector('[data-lab-description]')!.textContent =
      descriptions[active];
    const fallback = generateTheme('#5268E0', { name: 'Indigo fallback' }),
      returned = generateTheme('#277D59', { name: 'Forest response' });
    const options: ThemeOptions =
      active === 'standalone'
        ? { theme: returned, modeStorage: false }
        : {
            fallbackTheme: fallback,
            modeStorage: false,
            timeoutMs: active === 'timeout' ? 2000 : 5000,
            loadTheme: (signal) =>
              new Promise((resolve, reject) => {
                const failed = active === 'failure' && !retrySuccess,
                  timeout = active === 'timeout' && !retrySuccess;
                const timer = window.setTimeout(
                  () =>
                    failed
                      ? reject(new Error('Simulated request failed.'))
                      : resolve(returned),
                  timeout ? 20000 : 1200,
                );
                signal.addEventListener(
                  'abort',
                  () => {
                    clearTimeout(timer);
                    reject(new DOMException('Aborted', 'AbortError'));
                  },
                  { once: true },
                );
              }),
          };
    const store = createThemeStore(options);
    host.querySelector<HTMLElement>('[data-lab-request-note]')!.hidden =
      active === 'standalone';
    const update = () => {
      const state = store.getSnapshot();
      host.querySelector('[data-status]')!.textContent = state.pending
        ? 'Loading'
        : state.status === 'fallback'
          ? 'Fallback applied'
          : 'Ready';
      host.querySelector('[data-lab-name]')!.textContent = state.theme.name;
      host.querySelector<HTMLElement>('[data-lab-loading]')!.hidden =
        state.status !== 'loading';
      host.querySelector<HTMLElement>('[data-lab-content]')!.hidden =
        state.status === 'loading';
      host.querySelector<HTMLElement>('[data-lab-error]')!.hidden =
        !state.error;
      host.querySelector('[data-lab-error] p')!.textContent =
        state.error?.message ?? '';
      host.querySelector('[data-lab-mode]')!.textContent =
        `${state.modePreference} / ${state.mode}`;
      updateSample(
        host.querySelector('[data-lab-content]')!,
        themeConfiguration(state),
      );
    };
    unsubscribe = store.subscribe(update);
    update();
    stop = mountThemeStore(store, undefined, options);
    host.querySelector<HTMLButtonElement>('[data-retry]')!.onclick = () => {
      retrySuccess = true;
      void store.reload();
    };
  };
  host
    .querySelectorAll<HTMLButtonElement>('button[data-lab-display]')
    .forEach((button) =>
      button.addEventListener('click', () => {
        host.querySelector<HTMLElement>('.lab-grid')!.dataset.labDisplay =
          button.dataset.labDisplay;
        host
          .querySelectorAll('button[data-lab-display]')
          .forEach((tab) =>
            tab.setAttribute('aria-pressed', String(tab === button)),
          );
      }),
    );
  host.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach((b) =>
    b.addEventListener('click', () => {
      active = b.dataset.scenario!;
      run();
    }),
  );
  host.querySelector('[data-replay]')!.addEventListener('click', run);
  run();
  return () => {
    unsubscribe?.();
    stop?.();
  };
}

function customizationForm(settings: CustomSettings, changed: () => void) {
  const form = document.createElement('div');
  form.className = 'customization-form';
  form.innerHTML = `<p class="customization-title">Live customization</p><label>Thumb text<input data-custom="text" maxlength="3" value="${escape(settings.text)}"></label><div class="customization-color-field"><span>Controls color</span><div data-custom-color></div></div><label>Thumb size (px)<input data-custom="size" type="number" min="8" max="60" value="${settings.size}"></label><label>Track height (px)<input data-custom="track" type="number" min="2" max="24" value="${settings.track}"></label>`;
  const color = mountColorPopover(
    form.querySelector<HTMLElement>('[data-custom-color]')!,
    {
      label: 'Controls color',
      value: settings.color,
      onChange: (value) => {
        settings.color = value;
        changed();
      },
    },
  );
  form.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement,
      key = input.dataset.custom;
    if (!key) return;
    if (key === 'text') settings.text = input.value;
    if (key === 'size' || key === 'track') {
      const n = input.valueAsNumber;
      if (!Number.isFinite(n) || n < Number(input.min) || n > Number(input.max))
        return;
      settings[key] = n;
    }
    changed();
  });
  return Object.assign(form, { destroy: color.destroy });
}
