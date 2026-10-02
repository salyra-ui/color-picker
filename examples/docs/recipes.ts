import type { Integration, Kit } from './snippets';
export const recipeStyles = `.recipe { display: grid; gap: 24px; max-width: 760px; }
.recipe .tk-scope { display: grid; gap: 16px; min-width: 0; }
.recipe-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.recipe-actions button { padding: 8px 14px; cursor: pointer; }
.recipe-actions button:disabled { cursor: default; opacity: .45; }
.recipe-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 24px; border-radius: var(--border-radius-card); border: var(--border-width-card) solid currentColor; }
.recipe-preview button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 16px; border: 0; }
.recipe-output { overflow: auto; max-height: 260px; white-space: pre-wrap; }
.recipe input, .recipe select { max-width: 100%; }
.recipe .cp-area { height: 180px; }
.recipe .cp-swatch { width: 28px; height: 28px; }
.recipe label:not([class]) { display: flex; gap: 8px; align-items: center; }`;
export function controllerSource(kit: Kit) {
  if (kit === 'theme-studio')
    return `import { createThemeStore, createThemeEditor, generateTheme, themeConfiguration, themeColor, createThemeCollection, browserThemeCollectionStorage } from '@salyra-ui/theme-studio';
import { mountHistory, colorContrast, channelsToHex } from '@salyra-ui/color-picker';

export function createDemo() {
  const target = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light', modeStorage: false });
  const editor = createThemeEditor(target);
  const collection = createThemeCollection({storage:browserThemeCollectionStorage('example:themes'),favorites:[target.getSnapshot().theme]});
  const read = () => {
    const draft = editor.store.getSnapshot();
    const primary = draft.theme.structure.userPreset.primary;
    return { collection: collection.getSnapshot(), session: editor.getSnapshot(), history: editor.history.getSnapshot(),
      contrast: colorContrast(channelsToHex(primary.foreground), themeColor(draft.theme, 'primary')),
      tailwind: themeConfiguration(draft).tailwind };
  };
  let state = read();
  const listeners = new Set<() => void>();
  const update = () => { state = read(); listeners.forEach(fn => fn()); };
  const stops = [target.subscribe(update), editor.store.subscribe(update), editor.subscribe(update), editor.history.subscribe(update), collection.subscribe(update)];
  return {
    target, editor, collection,
    apply() { editor.apply(); collection.remember(target.getSnapshot().theme); },
    getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    mount(root: HTMLElement) { collection.load(); return mountHistory(root, editor.history); },
    destroy() { stops.forEach(stop => stop()); editor.destroy(); listeners.clear(); },
  };
}`;
  return `import { createColorStore, createColorHistory, createColorCollection, browserColorStorage, bindColorForm, mountHistory, colorContrast } from '@salyra-ui/color-picker';

export function createDemo() {
  const store = createColorStore('#5268E080');
  const history = createColorHistory(store);
  const collection = createColorCollection({ storage: browserColorStorage('example:colors'), favorites: ['#5268E0','#277D59','#C25D3D'] });
  let submitted = '';
  const read = () => ({ color: store.getSnapshot(), history: history.getSnapshot(), collection: collection.getSnapshot(), contrast: colorContrast(store.getSnapshot().value, '#FFFFFF'), submitted });
  let state = read();
  const listeners = new Set<() => void>();
  const update = () => { state = read(); listeners.forEach(fn => fn()); };
  const stops = [store.subscribe(update), history.subscribe(update), collection.subscribe(update)];
  return {
    store, history, collection, getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    submit(form: HTMLFormElement) { submitted = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2); update(); },
    mount(form: HTMLFormElement) {
      collection.load();
      const field = bindColorForm(form, store, { name: 'brandColor', format: 'hex', required: true });
      const detach = mountHistory(form, history);
      return () => { field.destroy(); detach(); };
    },
    destroy() { stops.forEach(stop => stop()); history.destroy(); listeners.clear(); },
  };
}`;
}
const studioReact = `<ThemeProvider store={demo.editor.store} modeStorage={false}>
        <ThemePicker view="shared-wheel" /><ThemeName /><ThemeRadius target="card" /><ThemeBorderWidth target="card" />
        <ThemeHarmony /><ThemeBackground />
        <ThemeSelect themes={view.collection.recent} label="Recent themes" /><ThemeSelect themes={view.collection.favorites} label="Favorite themes" />
      </ThemeProvider>
      <label><input type="checkbox" checked={view.session.locked.includes('accent')} onChange={e => demo.editor.setLocked('accent', e.target.checked)} />Lock accent during generation</label>
      <label><input type="checkbox" checked={view.session.live} onChange={e => demo.editor.setLive(e.target.checked)} />Apply changes live</label>
      <div className="recipe-actions">
        <button type="button" disabled={!view.history.canUndo} onClick={demo.editor.history.undo}>Undo</button>
        <button type="button" disabled={!view.history.canRedo} onClick={demo.editor.history.redo}>Redo</button>
        <button type="button" disabled={!view.session.dirty || view.session.conflict} onClick={() => demo.apply()}>Apply</button>
        <button type="button" disabled={!view.session.dirty && !view.session.conflict} onClick={demo.editor.cancel}>Cancel</button>
        <button type="button" onClick={() => demo.collection.toggleFavorite(demo.target.getSnapshot().theme)}>Favorite applied theme</button>
      </div>
      <p role="status">{view.session.conflict ? 'The applied theme changed. Cancel to load it.' : view.session.dirty ? 'Unapplied changes' : 'Up to date'}</p>
      <p>Primary text contrast: {view.contrast.ratio.toFixed(2)}:1 · {view.contrast.aa ? 'AA passes' : 'AA fails'}</p>
      <ThemeProvider store={demo.target} modeStorage={false}><article className="recipe-preview"><h2>Applied theme</h2><button type="button">Example button</button></article></ThemeProvider>
      <details><summary>Tailwind CSS</summary><pre className="recipe-output">{view.tailwind}</pre></details>`;
const colorReact = `<ColorProvider store={demo.store}><ColorArea /><ColorSlider channel="h" /><ColorSlider channel="alpha" /><ColorInput /><ColorCollection collection={demo.collection} kind="favorites" label="Favorite colors" /><ColorCollection collection={demo.collection} /></ColorProvider>
      <div className="recipe-actions"><button type="button" onClick={() => demo.collection.remember(view.color.value)}>Save color</button><button type="button" onClick={() => demo.collection.toggleFavorite(view.color.value)}>Toggle favorite</button><button type="button" disabled={!view.history.canUndo} onClick={demo.history.undo}>Undo</button><button type="button" disabled={!view.history.canRedo} onClick={demo.history.redo}>Redo</button><button type="reset">Reset</button><button type="submit">Submit</button></div>
      <p>Text on white: {view.contrast.ratio.toFixed(2)}:1 · {view.contrast.aa ? 'AA passes' : 'AA fails'}</p>
      <output className="recipe-output" aria-live="polite">{view.submitted}</output>`;
export function recipeSource(kit: Kit, integration: Integration) {
  const studio = kit === 'theme-studio';
  const components = studio
    ? 'ThemeProvider, ThemePicker, ThemeName, ThemeRadius, ThemeBorderWidth, ThemeHarmony, ThemeBackground, ThemeSelect'
    : 'ColorProvider, ColorArea, ColorSlider, ColorInput, ColorCollection';
  const root = studio ? 'div' : 'form';
  const react = studio ? studioReact : colorReact;
  if (integration === 'React')
    return `import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ${components} } from '@salyra-ui/${kit}/react';
import '@salyra-ui/${kit}/styles.min.css';
import './recipe.css';
import { createDemo } from './controller';
export default function App() {
  const [demo] = useState(createDemo);
  const view = useSyncExternalStore(demo.subscribe, demo.getSnapshot, demo.getSnapshot);
  const root = useRef<${studio ? 'HTMLDivElement' : 'HTMLFormElement'}>(null), lifecycle = useRef(0);
  useEffect(() => {
    const lease = ++lifecycle.current, detach = demo.mount(root.current!);
    return () => { detach(); queueMicrotask(() => { if (lifecycle.current === lease) demo.destroy(); }); };
  }, [demo]);
  return <${root} ref={root} className="recipe"${studio ? '' : ' onSubmit={e => { e.preventDefault(); demo.submit(e.currentTarget); }}'}>
      ${react}
    </${root}>;
}`;
  let markup = react
    .replaceAll('className=', 'class=')
    .replaceAll('modeStorage={false}', 'options={{ modeStorage: false }}');
  if (integration === 'Svelte') {
    markup = markup
      .replaceAll('onChange=', 'onchange=')
      .replaceAll('onClick=', 'onclick=')
      .replace(
        "checked={view.session.locked.includes('accent')} onchange={e => demo.editor.setLocked('accent', e.target.checked)}",
        "checked={view.session.locked.includes('accent')} onchange={e => demo.editor.setLocked('accent', e.currentTarget.checked)}",
      )
      .replace(
        'checked={view.session.live} onchange={e => demo.editor.setLive(e.target.checked)}',
        'checked={view.session.live} onchange={e => demo.editor.setLive(e.currentTarget.checked)}',
      );
    return `<script lang="ts">
  import { onMount } from 'svelte';
  import { ${components} } from '@salyra-ui/${kit}/svelte';
  import '@salyra-ui/${kit}/styles.min.css';
  import './recipe.css';
  import { createDemo } from './controller';
  const demo = createDemo();
  let root: ${studio ? 'HTMLDivElement' : 'HTMLFormElement'}, view = $state(demo.getSnapshot());
  onMount(() => { const stop = demo.subscribe(() => view = demo.getSnapshot()), detach = demo.mount(root); return () => { stop(); detach(); demo.destroy(); }; });
</script>
<${root} bind:this={root} class="recipe"${studio ? '' : ' onsubmit={e => { e.preventDefault(); demo.submit(e.currentTarget); }}'}>
${markup}
</${root}>`;
  }
  if (integration === 'Vue') {
    markup = markup
      .replaceAll('store={demo.editor.store}', ':store="demo.editor.store"')
      .replaceAll('store={demo.target}', ':store="demo.target"')
      .replaceAll('store={demo.store}', ':store="demo.store"')
      .replaceAll(
        'options={{ modeStorage: false }}',
        ':options="{ modeStorage: false }"',
      )
      .replaceAll(
        'collection={demo.collection}',
        ':collection="demo.collection"',
      );
    markup = markup.replace(/themes=\{([^}]+)\}/g, ':themes="$1"');
    markup = markup
      .replace(/disabled=\{([^}]+)\}/g, ':disabled="$1"')
      .replace(/checked=\{([^}]+)\}/g, ':checked="$1"');
    markup = markup
      .replace(
        /onClick=\{([^}]+)\}/g,
        (_m, value) => `@click="${value.replace(/^\(\) => /, '')}"`,
      )
      .replace(
        /onChange=\{e => ([^}]+)\}/g,
        (_m, value) =>
          `@change="${value.replaceAll('e.target.checked', '($event.target as HTMLInputElement).checked')}"`,
      )
      .replace(/\{(view\.[^}\n]+)\}/g, '{{ $1 }}');
    return `<script setup lang="ts">
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue';
import { ${components} } from '@salyra-ui/${kit}/vue';
import '@salyra-ui/${kit}/styles.min.css';
import './recipe.css';
import { createDemo } from './controller';
const demo = createDemo(), view = shallowRef(demo.getSnapshot()), root = ref<${studio ? 'HTMLDivElement' : 'HTMLFormElement'}>();
const stop = demo.subscribe(() => view.value = demo.getSnapshot());
let detach: (() => void) | undefined;
onMounted(() => { detach = demo.mount(root.value!); });
onBeforeUnmount(() => { stop(); detach?.(); demo.destroy(); });
</script>
<template><${root} ref="root" class="recipe"${studio ? '' : ' @submit.prevent="demo.submit(root!)"'}>
${markup}
</${root}></template>`;
  }
  if (integration === 'Angular') {
    markup = markup
      .replaceAll(
        'options={{ modeStorage: false }}',
        '[options]="{ modeStorage: false }"',
      )
      .replace(/store=\{([^}]+)\}/g, '[store]="$1"')
      .replace(/themes=\{([^}]+)\}/g, '[themes]="$1"')
      .replace(/collection=\{([^}]+)\}/g, '[collection]="$1"');
    markup = markup
      .replace(/disabled=\{([^}]+)\}/g, '[disabled]="$1"')
      .replace(/checked=\{([^}]+)\}/g, '[checked]="$1"');
    markup = markup
      .replace(
        /onClick=\{([^}]+)\}/g,
        (_m, value) =>
          `(click)="${value.startsWith('() => ') ? value.slice(6) : value + '()'}"`,
      )
      .replace(
        /onChange=\{e => ([^}]+)\}/g,
        (_m, value) =>
          `(change)="${value.replaceAll('e.target.checked', 'checked($event)')}"`,
      )
      .replace(/\{(view\.[^}\n]+)\}/g, '{{ $1 }}')
      .replace(/view\./g, 'view().');
    for (const component of components.split(', '))
      markup = markup
        .replaceAll(
          `<${component}`,
          `<${component
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase()
            .replace('theme-', 'tk-')
            .replace('color-', 'cp-')}`,
        )
        .replaceAll(
          `</${component}>`,
          `</${component
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase()
            .replace('theme-', 'tk-')
            .replace('color-', 'cp-')}>`,
        );
    return `import { Component, ElementRef, afterNextRender, DestroyRef, inject, signal } from '@angular/core';
import { ${components} } from '@salyra-ui/${kit}/angular';
import { createDemo } from './controller';
@Component({ selector: 'app-root', standalone: true, imports: [${components}], template: \`<${root} #root class="recipe"${studio ? '' : ' (submit)="$event.preventDefault(); demo.submit(root)"'}>${markup}</${root}>\` })
export class App {
  readonly demo = createDemo(); readonly view = signal(this.demo.getSnapshot());
  readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  checked(event: Event) { return (event.target as HTMLInputElement).checked; }
  constructor() { const stop = this.demo.subscribe(() => this.view.set(this.demo.getSnapshot())); let detach: (() => void) | undefined;
    afterNextRender(() => { detach = this.demo.mount(this.element.nativeElement.querySelector<${studio ? 'HTMLDivElement' : 'HTMLFormElement'}>('.recipe')!); });
    inject(DestroyRef).onDestroy(() => { stop(); detach?.(); this.demo.destroy(); });
  }
}`;
  }
  const nativeRoot = studio ? 'div' : 'form';
  const nativeMarkup = studio
    ? `<h2>Draft theme</h2><div data-editor></div><label>Recent themes<select data-theme-list="recent"></select></label><label>Favorite themes<select data-theme-list="favorites"></select></label><button type="button" data-favorite>Favorite applied theme</button><label><input type="checkbox" data-lock>Lock accent during generation</label><label><input type="checkbox" data-live>Apply changes live</label><div class="recipe-actions"><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="button" data-apply>Apply</button><button type="button" data-cancel>Cancel</button></div><p data-status role="status"></p><div data-applied class="recipe-preview"><h2>Applied theme</h2><button type="button">Example button</button></div><details><summary>Tailwind CSS</summary><pre data-output class="recipe-output"></pre></details>`
    : `<div data-picker></div><div data-favorites></div><div data-recent></div><div class="recipe-actions"><button type="button" data-save>Save color</button><button type="button" data-favorite>Toggle favorite</button><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="reset">Reset</button><button type="submit">Submit</button></div><output data-output class="recipe-output" aria-live="polite"></output>`;
  const nativeLogic = nativeRecipeScript(kit);
  if (integration === 'Astro') {
    const imports = studio
      ? `import { generateTheme, createThemeStore, themeConfiguration } from '@salyra-ui/theme-studio';\n${['ThemeProvider', 'ThemePicker', 'ThemeName', 'ThemeRadius', 'ThemeBorderWidth', 'ThemeHarmony', 'ThemeBackground'].map((name) => `import ${name} from '@salyra-ui/theme-studio/astro/${name}.astro';`).join('\n')}\nconst theme = generateTheme('#5268E0');\nconst appliedCss = themeConfiguration(createThemeStore({ theme, mode: 'light', modeStorage: false }).getSnapshot()).css;`
      : `import { createColorStore } from '@salyra-ui/color-picker';\n${['ColorProvider', 'ColorArea', 'ColorSlider', 'ColorInput'].map((name) => `import ${name} from '@salyra-ui/color-picker/astro/${name}.astro';`).join('\n')}\nconst color = createColorStore('#5268E080').getSnapshot();`;
    const serverMarkup = studio
      ? nativeMarkup
          .replace(
            '<div data-editor></div>',
            `<div data-editor><ThemeProvider {theme} mode="light" modeStorage={false}><ThemePicker {theme} /><ThemeName {theme} /><ThemeRadius {theme} target="card" /><ThemeBorderWidth {theme} target="card" /><ThemeHarmony /><ThemeBackground {theme} /></ThemeProvider></div>`,
          )
          .replace(
            '<div data-applied class="recipe-preview">',
            '<div data-applied class="recipe-preview" style={appliedCss}>',
          )
      : nativeMarkup.replace(
          '<div data-picker></div>',
          `<div data-picker><ColorProvider value="#5268E080"><ColorArea value="#5268E080" /><ColorSlider channel="h" value={color.h} /><ColorSlider channel="alpha" value={color.alpha * 100} /><ColorInput value="#5268E080" /></ColorProvider></div>`,
        );
    const client = nativeLogic.replace(
      studio
        ? "const picker = mountThemeKit(root.querySelector<HTMLElement>('[data-editor]')!, { store: demo.editor.store, modeStorage: false });"
        : "const picker = mountColorPicker(root.querySelector<HTMLElement>('[data-picker]')!, { store: demo.store });",
      studio
        ? "const provider = root.querySelector<ThemeProviderElement>('[data-editor] tk-provider')!; provider.setStore(demo.editor.store, {modeStorage:false}); const picker = {destroy: () => provider.remove()};"
        : "const provider = root.querySelector<ColorProviderElement>('[data-picker] cp-provider')!; provider.setStore(demo.store); const picker = {destroy: () => provider.remove()};",
    );
    return `---\n${imports}\nimport '@salyra-ui/${kit}/styles.min.css';\nimport './recipe.css';\n---\n<${nativeRoot} class="recipe" data-recipe="${kit}">${serverMarkup}<p data-contrast></p></${nativeRoot}>\n<script>\nimport type { ${studio ? 'ThemeProviderElement' : 'ColorProviderElement'} } from '@salyra-ui/${kit}/astro/client';\n${client}\n</script>`;
  }
  return `<${nativeRoot} class="recipe" data-recipe="${kit}">${nativeMarkup}<p data-contrast></p></${nativeRoot}>
<script type="module">
${nativeLogic}
</script>`;
}
export function nativeRecipeScript(kit: Kit) {
  const studio = kit === 'theme-studio';
  return `import { ${studio ? 'mountThemeKit, themeConfiguration' : 'mountColorPicker, mountColorCollection'} } from '@salyra-ui/${kit}/vanilla';
import { createDemo } from './controller';
import '@salyra-ui/${kit}/styles.min.css';
import './recipe.css';
for (const root of document.querySelectorAll<${studio ? 'HTMLDivElement' : 'HTMLFormElement'}>('[data-recipe="${kit}"]')) {
  const demo = createDemo();
  const button = (name: string) => root.querySelector<HTMLButtonElement>('[data-' + name + ']')!;
  const ${studio ? 'picker' : 'picker'} = ${studio ? "mountThemeKit(root.querySelector<HTMLElement>('[data-editor]')!, { store: demo.editor.store, modeStorage: false })" : "mountColorPicker(root.querySelector<HTMLElement>('[data-picker]')!, { store: demo.store })"};
  ${
    studio
      ? `root.querySelector('[data-editor] details')?.remove();
  button('apply').onclick = demo.apply;
  button('favorite').onclick = () => demo.collection.toggleFavorite(demo.target.getSnapshot().theme);
  for(const list of root.querySelectorAll<HTMLSelectElement>('[data-theme-list]')) list.onchange = () => { const theme = demo.collection.getSnapshot()[list.dataset.themeList as 'recent' | 'favorites'].find(theme => theme.id === list.value); if(theme) demo.editor.store.setTheme(theme); };  button('cancel').onclick = demo.editor.cancel;
  root.querySelector<HTMLInputElement>('[data-lock]')!.onchange = e => demo.editor.setLocked('accent', (e.currentTarget as HTMLInputElement).checked);
  root.querySelector<HTMLInputElement>('[data-live]')!.onchange = e => demo.editor.setLive((e.currentTarget as HTMLInputElement).checked);`
      : `const favorites = mountColorCollection(root.querySelector<HTMLElement>('[data-favorites]')!, demo.store, demo.collection, { kind: 'favorites' });
  const recent = mountColorCollection(root.querySelector<HTMLElement>('[data-recent]')!, demo.store, demo.collection);
  button('save').onclick = () => demo.collection.remember(demo.store.getSnapshot().value);
  button('favorite').onclick = () => demo.collection.toggleFavorite(demo.store.getSnapshot().value);
  root.onsubmit = e => { e.preventDefault(); demo.submit(root); };`
  }
  button('undo').onclick = demo.${studio ? 'editor.' : ''}history.undo; button('redo').onclick = demo.${studio ? 'editor.' : ''}history.redo;
  const update = () => {
    const state = demo.getSnapshot();
    button('undo').disabled = !state.history.canUndo; button('redo').disabled = !state.history.canRedo;
    ${
      studio
        ? `root.querySelector('[data-editor] details')?.remove();
  button('apply').disabled = !state.session.dirty || state.session.conflict;
    button('cancel').disabled = !state.session.dirty && !state.session.conflict;
    for(const list of root.querySelectorAll<HTMLSelectElement>('[data-theme-list]')) {
      list.replaceChildren(new Option('Choose a theme',''));
      const themes = state.collection[list.dataset.themeList as 'recent' | 'favorites'];
      for(const theme of themes) list.add(new Option(theme.name,theme.id));
      list.disabled = !themes.length;
    }
    root.querySelector('[data-status]')!.textContent = state.session.conflict ? 'The applied theme changed. Cancel to load it.' : state.session.dirty ? 'Unapplied changes' : 'Up to date';
    root.querySelector<HTMLElement>('[data-applied]')!.style.cssText = themeConfiguration(demo.target.getSnapshot()).css;`
        : ''
    }
    root.querySelector('[data-output]')!.textContent = state.${studio ? 'tailwind' : 'submitted'};
    root.querySelector('[data-contrast]')!.textContent = 'Text contrast: ' + state.contrast.ratio.toFixed(2) + ':1 · ' + (state.contrast.aa ? 'AA passes' : 'AA fails');
  };
  const stop = demo.subscribe(update), detach = demo.mount(root); update();
  const destroy = () => { stop(); detach(); picker.destroy(); ${studio ? '' : 'favorites.destroy(); recent.destroy();'} demo.destroy(); };
  window.addEventListener('pagehide', destroy, { once: true });
  document.addEventListener('astro:before-swap', destroy, { once: true });
}`;
}
export function recipeFiles(kit: Kit, integration: Integration) {
  const source = recipeSource(kit, integration);
  const appFile = {
    React: 'App.tsx',
    Svelte: 'App.svelte',
    Vue: 'App.vue',
    Angular: 'app.ts',
    Astro: 'index.astro',
    Vanilla: 'index.html',
  }[integration];
  let appCode = source;
  const files = [
    { name: appFile, code: appCode },
    { name: 'controller.ts', code: controllerSource(kit) },
    { name: 'recipe.css', code: recipeStyles },
  ];
  if (integration === 'Vanilla') {
    const script = source.match(
      /<script type="module">([\s\S]+)<\/script>/,
    )![1];
    files[0].code = source.replace(
      /<script type="module">[\s\S]+<\/script>/,
      '<script type="module" src="/main.ts"></script>',
    );
    files.push({ name: 'main.ts', code: script });
  }
  const dependencies: Record<string, string> = {
    '@salyra-ui/color-picker': '^1.0.0',
    ...(kit === 'theme-studio' ? { '@salyra-ui/theme-studio': '^1.0.0' } : {}),
  };
  const devDependencies: Record<string, string> = {
    typescript: '~5.8.3',
    vite: '^6.1.0',
  };
  const scripts: Record<string, string> = { dev: 'vite', build: 'vite build' };
  if (integration === 'React') {
    Object.assign(dependencies, { react: '^18.3.1', 'react-dom': '^18.3.1' });
    Object.assign(devDependencies, {
      '@vitejs/plugin-react': '^4.3.0',
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
    });
    files.push(
      {
        name: 'main.tsx',
        code: "import { createRoot } from 'react-dom/client';\nimport { StrictMode } from 'react';\nimport App from './App';\ncreateRoot(document.getElementById('app')!).render(<StrictMode><App /></StrictMode>);",
      },
      {
        name: 'vite.config.ts',
        code: "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });",
      },
    );
  }
  if (integration === 'Svelte') {
    files.push({ name: 'svelte.config.js', code: 'export default {};' });
    Object.assign(dependencies, { svelte: '^5.20.0' });
    Object.assign(devDependencies, {
      '@sveltejs/vite-plugin-svelte': '^5.0.0',
    });
    files.push(
      {
        name: 'main.ts',
        code: "import { mount } from 'svelte';\nimport App from './App.svelte';\nmount(App, {target:document.getElementById('app')!});",
      },
      {
        name: 'vite.config.ts',
        code: "import { defineConfig } from 'vite';\nimport { svelte } from '@sveltejs/vite-plugin-svelte';\nexport default defineConfig({ plugins: [svelte()] });",
      },
    );
  }
  if (integration === 'Vue') {
    Object.assign(dependencies, { vue: '^3.5.0' });
    Object.assign(devDependencies, { '@vitejs/plugin-vue': '^5.2.0' });
    files.push(
      {
        name: 'main.ts',
        code: "import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');",
      },
      {
        name: 'vite.config.ts',
        code: "import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nexport default defineConfig({ plugins: [vue()] });",
      },
    );
  }
  if (integration === 'Angular') {
    files[2].code =
      `@import '@salyra-ui/${kit}/styles.min.css';\n` + files[2].code;
    Object.assign(dependencies, {
      '@angular/core': '~19.2.0',
      '@angular/common': '~19.2.0',
      '@angular/compiler': '~19.2.0',
      '@angular/platform-browser': '~19.2.0',
      'zone.js': '~0.15.0',
      rxjs: '^7.8.1',
    });
    Object.assign(devDependencies, {
      '@angular/cli': '~19.2.0',
      '@angular/compiler-cli': '~19.2.0',
      '@angular-devkit/build-angular': '~19.2.0',
    });
    delete devDependencies.vite;
    scripts.dev = 'ng serve';
    scripts.build = 'ng build';
    files.push(
      {
        name: 'main.ts',
        code: "import 'zone.js';\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { App } from './app';\nbootstrapApplication(App).catch(console.error);",
      },
      {
        name: 'angular.json',
        code: JSON.stringify(
          {
            version: 1,
            projects: {
              example: {
                projectType: 'application',
                root: '',
                sourceRoot: '',
                architect: {
                  build: {
                    builder: '@angular-devkit/build-angular:application',
                    options: {
                      browser: 'main.ts',
                      index: 'index.html',
                      tsConfig: 'tsconfig.json',
                      outputPath: 'dist',
                      styles: ['recipe.css'],
                    },
                  },
                  serve: {
                    builder: '@angular-devkit/build-angular:dev-server',
                    options: { buildTarget: 'example:build' },
                  },
                },
              },
            },
          },
          null,
          2,
        ),
      },
    );
  }
  if (integration === 'Astro') {
    dependencies.astro = '^5.0.0';
    delete devDependencies.vite;
    scripts.dev = 'astro dev';
    scripts.build = 'astro build';
    files[0].name = 'src/pages/index.astro';
    files[0].code = source
      .replaceAll("'./controller'", "'../controller'")
      .replaceAll("'./recipe.css'", "'../recipe.css'");
    files[1].name = 'src/controller.ts';
    files[2].name = 'src/recipe.css';
    files.push({
      name: 'astro.config.mjs',
      code: "import { defineConfig } from 'astro/config';\nexport default defineConfig({});",
    });
  } else if (integration !== 'Vanilla')
    files.push({
      name: 'index.html',
      code: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Salyra UI example</title></head><body>${integration === 'Angular' ? '<app-root></app-root>' : '<div id="app"></div><script type="module" src="/main.' + (integration === 'React' ? 'tsx' : 'ts') + '"></script>'}</body></html>`,
    });
  files.push({
    name: 'package.json',
    code: JSON.stringify(
      {
        name: `salyra-${kit}-${integration.toLowerCase()}-example`,
        private: true,
        type: 'module',
        scripts,
        dependencies,
        devDependencies,
      },
      null,
      2,
    ),
  });
  files.push({
    name: 'tsconfig.json',
    code: JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          skipLibCheck: true,
          jsx: 'react-jsx',
          esModuleInterop: true,
          experimentalDecorators: true,
          useDefineForClassFields: false,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        },
        include: ['**/*.ts', '**/*.tsx', '**/*.svelte', '**/*.vue'],
        angularCompilerOptions: { strictTemplates: true },
      },
      null,
      2,
    ),
  });
  files.push({
    name: 'README.md',
    code: `# ${kit} / ${integration}\n\nRun npm install, then npm run dev.\n\nThe controller holds shared state. App uses native ${integration} components.\n\n${kit === 'theme-studio' ? 'Edits stay in a draft until Apply. Cancel loads the applied theme. Undo/Redo tracks edits. Lock accent excludes it from generation. Exported Tailwind CSS contains only registered editor fields. Import the exported stylesheet after Tailwind.' : 'Submit reads the real form field. Reset restores the starting RGBA color. Save color adds a recent swatch. Favorite colors are optional and persist through the provided storage adapter.'}\n`,
  });
  return files;
}
