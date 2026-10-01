import {
  mountColorPicker,
  mountColorCollection,
  createColorStore,
  createColorHistory,
  createColorCollection,
  browserColorStorage,
  bindColorForm,
  mountHistory,
  colorContrast,
  channelsToHex,
} from '@salyra-ui/color-picker/vanilla';
import {
  mountThemeKit,
  createThemeStore,
  createThemeEditor,
  generateTheme,
  themeConfiguration,
  themeColor,
  createThemeCollection,
  browserThemeCollectionStorage,
} from '@salyra-ui/theme-studio/vanilla';
export function mountEditingLab(host: HTMLElement) {
  host.innerHTML = `<div class="editing-lab"><div><h3>Draft theme</h3><div data-editor></div><div class="lab-options"><label>Recent themes<select data-theme-list="recent"></select></label><label>Favorite themes<select data-theme-list="favorites"></select></label><label><input type="checkbox" data-lock>Lock accent during generation</label><label><input type="checkbox" data-live>Apply changes live</label></div><div class="recipe-actions"><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="button" data-apply>Apply</button><button type="button" data-cancel>Cancel</button><button type="button" data-favorite>Favorite applied theme</button></div><p data-status role="status"></p></div><div class="lab-applied"><h3>Applied theme</h3><article data-applied class="recipe-preview"><h4>Project settings</h4><p>Changes appear here after Apply.</p><button type="button">Save changes</button></article><p data-contrast></p><details class="configuration"><summary>Tailwind CSS</summary><pre data-output class="recipe-output" tabindex="0"></pre><button type="button" data-copy>Copy Tailwind CSS</button><p data-copy-status aria-live="polite"></p></details></div></div>`;
  const target = createThemeStore({
      theme: generateTheme('#5268E0'),
      mode: 'light',
      modeStorage: false,
    }),
    editor = createThemeEditor(target);
  const collection = createThemeCollection({
    storage: browserThemeCollectionStorage('docs:themes'),
    favorites: [target.getSnapshot().theme],
  });
  collection.load();
  const picker = mountThemeKit(
    host.querySelector<HTMLElement>('[data-editor]')!,
    { store: editor.store, modeStorage: false },
  );
  picker.element.querySelector('details')?.remove();
  const button = (name: string) =>
    host.querySelector<HTMLButtonElement>('[data-' + name + ']')!;
  const update = () => {
    const state = editor.getSnapshot(),
      history = editor.history.getSnapshot(),
      draft = editor.store.getSnapshot();
    button('undo').disabled = !history.canUndo;
    button('redo').disabled = !history.canRedo;
    button('apply').disabled = !state.dirty || state.conflict;
    button('cancel').disabled = !state.dirty && !state.conflict;
    for (const list of host.querySelectorAll<HTMLSelectElement>(
      '[data-theme-list]',
    )) {
      const themes =
        collection.getSnapshot()[
          list.dataset.themeList as 'recent' | 'favorites'
        ];
      list.replaceChildren(new Option('Choose a theme', ''));
      for (const theme of themes) list.add(new Option(theme.name, theme.id));
      list.disabled = !themes.length;
    }
    host.querySelector('[data-status]')!.textContent = state.conflict
      ? 'The applied theme changed. Cancel to load it.'
      : state.dirty
        ? 'Unapplied changes'
        : 'Up to date';
    host.querySelector<HTMLElement>('[data-applied]')!.style.cssText =
      themeConfiguration(target.getSnapshot()).css;
    const primary = draft.theme.structure.userPreset.primary,
      c = colorContrast(
        channelsToHex(primary.foreground),
        themeColor(draft.theme, 'primary'),
      );
    host.querySelector('[data-contrast]')!.textContent =
      `Primary text contrast: ${c.ratio.toFixed(2)}:1 · ${c.aa ? 'AA passes' : 'AA fails'}`;
    host.querySelector('[data-output]')!.textContent =
      themeConfiguration(draft).tailwind;
  };
  button('undo').onclick = editor.history.undo;
  button('redo').onclick = editor.history.redo;
  button('apply').onclick = () => {
    editor.apply();
    collection.remember(target.getSnapshot().theme);
  };
  button('favorite').onclick = () =>
    collection.toggleFavorite(target.getSnapshot().theme);
  for (const list of host.querySelectorAll<HTMLSelectElement>(
    '[data-theme-list]',
  ))
    list.onchange = () => {
      const theme = collection
        .getSnapshot()
        [list.dataset.themeList as 'recent' | 'favorites'].find(
          (theme) => theme.id === list.value,
        );
      if (theme) editor.store.setTheme(theme);
    };
  button('cancel').onclick = editor.cancel;
  host.querySelector<HTMLInputElement>('[data-lock]')!.onchange = (e) =>
    editor.setLocked('accent', (e.currentTarget as HTMLInputElement).checked);
  host.querySelector<HTMLInputElement>('[data-live]')!.onchange = (e) =>
    editor.setLive((e.currentTarget as HTMLInputElement).checked);
  button('copy').onclick = async () => {
    try {
      await navigator.clipboard.writeText(
        themeConfiguration(editor.store.getSnapshot()).tailwind,
      );
      host.querySelector('[data-copy-status]')!.textContent =
        'Tailwind CSS copied.';
    } catch {
      host.querySelector('[data-copy-status]')!.textContent =
        'Select the CSS and copy it with your keyboard.';
    }
  };
  const stops = [
    target.subscribe(update),
    editor.store.subscribe(update),
    editor.subscribe(update),
    editor.history.subscribe(update),
    collection.subscribe(update),
  ];
  const detach = mountHistory(host, editor.history);
  update();
  return () => {
    stops.forEach((stop) => stop());
    detach();
    picker.destroy();
    editor.destroy();
    host.replaceChildren();
  };
}
export function mountColorFormLab(host: HTMLElement) {
  host.innerHTML = `<form class="color-form-lab"><div data-picker></div><div data-favorites></div><div data-recent></div><div class="recipe-actions"><button type="button" data-save>Save color</button><button type="button" data-favorite>Toggle favorite</button><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="reset">Reset</button><button type="submit">Submit</button></div><p data-contrast></p><p>Submit reads <code>brandColor</code> from FormData. Reset restores the starting color.</p><output data-output class="recipe-output" aria-live="polite"></output></form>`;
  const form = host.querySelector('form')!,
    store = createColorStore('#5268E080'),
    history = createColorHistory(store);
  const collection = createColorCollection({
    storage: browserColorStorage('docs:color-collection'),
    favorites: ['#5268E0', '#277D59', '#C25D3D'],
  });
  collection.load();
  const picker = mountColorPicker(
    host.querySelector<HTMLElement>('[data-picker]')!,
    { store },
  );
  const favorites = mountColorCollection(
      host.querySelector<HTMLElement>('[data-favorites]')!,
      store,
      collection,
      { kind: 'favorites' },
    ),
    recent = mountColorCollection(
      host.querySelector<HTMLElement>('[data-recent]')!,
      store,
      collection,
    );
  const field = bindColorForm(form, store, {
      name: 'brandColor',
      required: true,
    }),
    detach = mountHistory(form, history);
  const button = (name: string) =>
    host.querySelector<HTMLButtonElement>('[data-' + name + ']')!;
  const update = () => {
    button('undo').disabled = !history.getSnapshot().canUndo;
    button('redo').disabled = !history.getSnapshot().canRedo;
    const c = colorContrast(store.getSnapshot().value, '#FFFFFF');
    host.querySelector('[data-contrast]')!.textContent =
      `Text on white: ${c.ratio.toFixed(2)}:1 · ${c.aa ? 'AA passes' : 'AA fails'}`;
  };
  button('undo').onclick = history.undo;
  button('redo').onclick = history.redo;
  button('save').onclick = () => collection.remember(store.getSnapshot().value);
  button('favorite').onclick = () =>
    collection.toggleFavorite(store.getSnapshot().value);
  form.onsubmit = (e) => {
    e.preventDefault();
    host.querySelector('[data-output]')!.textContent = JSON.stringify(
      Object.fromEntries(new FormData(form)),
      null,
      2,
    );
  };
  const stops = [store.subscribe(update), history.subscribe(update)];
  update();
  return () => {
    stops.forEach((stop) => stop());
    field.destroy();
    detach();
    favorites.destroy();
    recent.destroy();
    picker.destroy();
    history.destroy();
    host.replaceChildren();
  };
}
