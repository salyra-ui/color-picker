import { sourceFiles } from './code-files';
import {
  createColorStore,
  type ColorProviderElement,
  type ColorInfo,
} from '@sebytza23/color-picker-vanilla';
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
} from '@sebytza23/theme-kit-vanilla';
import {
  integrations,
  colorVariants,
  themeVariants,
  colorMarkup,
  colorExample,
  themeExample,
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
    files?: (integration: Integration) => { name: string; code: string }[];
  } = {},
) {
  let current = options.integration ?? 'React';
  let selectedFile = 0;
  let files: { name: string; code: string }[] = [];
  const id = `source-${++panelSequence}`;
  host.classList.add('code-panel');
  host.innerHTML = `<div class="code-toolbar"><div class="framework-tabs" role="tablist" aria-label="${escape(options.label ?? 'Example')} framework" ${options.file ? 'hidden' : ''}>${integrations.map((i) => `<button type="button" role="tab" id="${id}-${i}" aria-controls="${id}-code" data-framework="${i}">${i}</button>`).join('')}</div><span class="fixed-source-file" ${options.file ? '' : 'hidden'}>${escape(options.file ?? '')}</span><button type="button" class="copy-button">Copy code</button></div><div class="source-file-tabs" role="tablist" aria-label="${escape(options.label ?? 'Example')} files"></div><pre id="${id}-code" role="tabpanel" tabindex="0"><code></code></pre><p class="copy-status" aria-live="polite"></p>`;
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
    fileTabs.hidden = Boolean(options.file);
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
export function sampleMarkup() {
  return `<div class="theme-sample"><div class="sample-header"><span>Application preview</span><span data-sample-mode></span></div><article class="sample-card"><span class="sample-name" data-sample-name></span><h3>Project settings</h3><p>Buttons, inputs and surfaces use the active theme tokens.</p><label>Project name<input value="Website redesign" aria-label="Example project name"></label><div class="sample-actions"><button class="sample-primary" type="button">Save changes</button><button class="sample-secondary" type="button">Cancel</button></div><div class="sample-note">Accent surface</div></article><div class="sample-colors">${['primary', 'secondary', 'accent'].map((r) => `<span style="--role:var(--${r})"><i></i>${r}</span>`).join('')}</div></div>`;
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
) {
  const isColor = kit === 'color-picker',
    variants = isColor ? colorVariants : themeVariants;
  let variant = initial ?? variants[0].id,
    cleanup: (() => void) | undefined;
  let custom: CustomSettings = {
    ...defaultCustom,
    ...(isColor ? {} : { text: 'B', size: 26 }),
  };
  host.classList.add('explorer');
  host.innerHTML = `<div class="variant-tabs" role="group" aria-label="${isColor ? 'Color picker' : 'Theme kit'} example">${variants.map((v) => `<button type="button" data-variant="${v.id}" aria-pressed="${v.id === variant}">${v.title}</button>`).join('')}</div><div class="example-description"><p></p><div class="view-tabs" role="group" aria-label="Example display"><button type="button" data-display="preview" aria-pressed="false">Preview</button><button type="button" data-display="split" aria-pressed="true">Split</button><button type="button" data-display="code" aria-pressed="false">Code</button></div></div><div class="example-body" data-display="split"><div class="example-preview"><div class="preview-label">Interactive preview <span>Vanilla adapter</span></div><div class="preview-content"></div></div><div class="example-code"></div></div>`;
  const body = host.querySelector<HTMLElement>('.example-body')!,
    content = host.querySelector<HTMLElement>('.preview-content')!,
    description = host.querySelector('.example-description p')!;
  const panel = codePanel(
    host.querySelector('.example-code')!,
    (i) =>
      isColor
        ? colorExample(i, variant as ColorVariant, custom)
        : themeExample(i, variant as ThemeVariant, custom),
    {
      label: isColor ? 'Color picker' : 'Theme editor',
      baseName: isColor ? 'ColorPicker' : 'ThemeEditor',
    },
  );
  const show = () => {
    cleanup?.();
    content.replaceChildren();
    host
      .querySelectorAll<HTMLButtonElement>('[data-variant]')
      .forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.variant === variant)),
      );
    description.textContent = variants.find(
      (v) => v.id === variant,
    )!.description;
    if (isColor) {
      content.innerHTML = `<div class="color-demo">${colorMarkup(variant as ColorVariant)}<div class="color-result"><div class="swatch-checker"><div data-color-swatch></div></div><div><h3 data-color-name></h3><p data-color-match></p><code data-color-hex></code></div></div></div><details class="color-values"><summary>All color values</summary><dl data-color-values></dl></details>`;
      if (variant === 'custom') {
        const form = customizationForm(custom, () => applyCustomization());
        content.prepend(form);
      }
      const store = createColorStore(
        '#5268E080',
        variant === 'channels' ? 'rgb' : 'hex',
      );
      const provider =
        content.querySelector<ColorProviderElement>('cp-provider')!;
      provider.setStore(store);
      const update = () => colorReadout(content, store.getColor());
      provider.addEventListener('color-change', update);
      update();
      cleanup = () => {
        provider.removeEventListener('color-change', update);
        provider.remove();
      };
    } else {
      content.innerHTML = `<div class="theme-demo"><div class="theme-controls"></div><div class="sample-host">${sampleMarkup()}</div></div><details class="configuration"><summary>Generated configuration</summary><div class="output-actions"><label>Format<select data-output-format aria-label="Configuration format"><option value="json">JSON</option><option value="css">CSS</option></select></label><button type="button" data-copy-output>Copy output</button><button type="button" data-download>Download</button></div><pre tabindex="0"></pre><p data-output-status aria-live="polite"></p></details>`;
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
      const format = content.querySelector<HTMLSelectElement>(
        '[data-output-format]',
      )!;
      format.value = variant === 'single' ? 'css' : 'json';
      const renderOutput = () => {
        output.textContent = format.value === 'css' ? css : json;
      };
      format.addEventListener('change', renderOutput);
      const changed = (config: ThemeConfiguration) => {
        updateSample(sample, themeConfiguration(mountedStore(config)));
        json = config.json;
        css = `:root {\n${Object.entries(config.tokens)
          .map(([name, value]) => `  ${name}: ${value};`)
          .join('\n')}\n}`;
        renderOutput();
      };
      if (variant === 'custom') {
        content.prepend(customizationForm(custom, () => applyCustomization()));
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
          changed(themeConfiguration(store.getSnapshot())),
        );
        changed(themeConfiguration(store.getSnapshot()));
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
        const mounted = mountThemeKit(controls, {
          theme: themes[0],
          themes,
          mode: 'light',
          modeStorage: false,
          picker: {
            view: variant === 'rectangle' ? 'area' : 'shared-wheel',
            ...(variant === 'single' ? { roles: ['primary'] as const } : {}),
          },
          onChange(config) {
            changed(
              variant === 'single'
                ? themeConfiguration(mountedStore(config), {
                    roles: ['primary'],
                  })
                : config,
            );
          },
        });
        cleanup = mounted.destroy;
      }
      content
        .querySelector('[data-copy-output]')!
        .addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(
              format.value === 'css' ? css : json,
            );
            content.querySelector('[data-output-status]')!.textContent =
              'JSON copied.';
          } catch {
            content.querySelector('[data-output-status]')!.textContent =
              'Select the output and copy it with your keyboard.';
          }
        });
      content
        .querySelector('[data-download]')!
        .addEventListener('click', () =>
          download(
            format.value === 'css' ? css : json,
            format.value === 'css' ? 'theme.css' : 'theme.json',
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
  host.querySelectorAll<HTMLButtonElement>('[data-variant]').forEach((b) =>
    b.addEventListener('click', () => {
      variant = b.dataset.variant as typeof variant;
      show();
    }),
  );
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
  return () => cleanup?.();
}
function mountedStore(
  config: ThemeConfiguration,
): import('@sebytza23/theme-kit').ThemeSnapshot {
  return {
    theme: config.theme,
    mode: config.mode,
    modePreference: config.modePreference,
    systemMode: config.systemMode,
    status: 'ready',
    pending: false,
    error: null,
    background: config.theme.backgroundMode ?? 'preserve',
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
  host.innerHTML = `<div class="lab-controls" role="group" aria-label="Rendering scenario"><button data-scenario="standalone" aria-pressed="true">Standalone</button><button data-scenario="success" aria-pressed="false">Fetch success</button><button data-scenario="failure" aria-pressed="false">Fetch error</button><button data-scenario="timeout" aria-pressed="false">Timeout</button></div><div class="lab-description"><p data-lab-description></p><p class="muted">The preview simulates a request locally; the source uses /api/theme. Return a Theme object as JSON. HTTP errors, invalid theme data and timeouts apply the fallback.</p></div><div class="lab-grid"><div class="lab-preview"><div class="request-status" role="status"><span data-status></span><span data-lab-name></span></div><div data-lab-loading class="loading-example" hidden><div class="loading-bar"></div><h3>Loading theme</h3><p>This area is custom loading content.</p></div><div data-lab-content>${sampleMarkup()}</div><div class="error-example" data-lab-error hidden><p></p><button type="button" data-retry>Retry successfully</button></div><div class="lab-replay"><button type="button" data-replay>Run again</button><span data-lab-mode></span></div></div><div data-lab-code></div></div>`;
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
  form.innerHTML = `<p class="customization-title">Live customization</p><label>Thumb text<input data-custom="text" maxlength="3" value="${escape(settings.text)}"></label><label>Controls color<input data-custom="color" type="color" value="${settings.color}"></label><label>Thumb size (px)<input data-custom="size" type="number" min="8" max="60" value="${settings.size}"></label><label>Track height (px)<input data-custom="track" type="number" min="2" max="24" value="${settings.track}"></label>`;
  form.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement,
      key = input.dataset.custom;
    if (key === 'text') settings.text = input.value;
    if (key === 'color') settings.color = input.value;
    if (key === 'size' || key === 'track') {
      const n = input.valueAsNumber;
      if (!Number.isFinite(n) || n < Number(input.min) || n > Number(input.max))
        return;
      settings[key] = n;
    }
    changed();
  });
  return form;
}
