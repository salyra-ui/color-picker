import {
  createColorStore,
  createColorHistory,
  createColorCollection,
  browserColorStorage,
  mountColorPicker,
  mountColorCollection,
  mountHistory,
  colorContrast,
} from '@salyra-ui/color-picker/vanilla';
import {
  seed,
  actions,
  button,
  field,
  listenButton,
  output,
} from './workflow-ui';
export function mountWorkflow(host: HTMLElement, id: string): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: { subscribe: (fn: () => void) => () => void },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  const store = createColorStore('#5268E080');
  host.innerHTML =
    '<div data-picker></div><div data-controls></div><pre data-result aria-live="polite"></pre>';
  const picker = mountColorPicker(
    host.querySelector<HTMLElement>('[data-picker]')!,
    { store },
  );
  cleanup.push(picker.destroy);
  const controls = host.querySelector<HTMLElement>('[data-controls]')!;
  if (id === 'history') {
    const history = createColorHistory(store, { limit: 20 });
    controls.innerHTML = actions(
      button('undo', 'Undo') + button('redo', 'Redo'),
    );
    listenButton(host, 'undo', history.undo);
    listenButton(host, 'redo', history.redo);
    const update = () => {
      const state = history.getSnapshot();
      host.querySelector<HTMLButtonElement>('[data-action="undo"]')!.disabled =
        !state.canUndo;
      host.querySelector<HTMLButtonElement>('[data-action="redo"]')!.disabled =
        !state.canRedo;
      output(
        host,
        `${store.getSnapshot().value}\nHistory position ${state.index + 1} of ${state.length}`,
      );
    };
    subscribe(history, update);
    subscribe(store, update);
    cleanup.push(mountHistory(host, history), history.destroy);
    update();
  } else if (id === 'collections') {
    const collection = createColorCollection({
      limit: 8,
      favorites: [seed, '#277D59'],
      storage: browserColorStorage('examples:recent-colors'),
    });
    collection.load();
    controls.innerHTML =
      actions(
        button('remember', 'Save to recent') +
          button('favorite', 'Toggle favorite') +
          button('clear', 'Clear recent'),
      ) + '<div data-recent></div><div data-favorites></div>';
    const recent = mountColorCollection(
      host.querySelector<HTMLElement>('[data-recent]')!,
      store,
      collection,
      { label: 'Recent colors' },
    );
    const favorites = mountColorCollection(
      host.querySelector<HTMLElement>('[data-favorites]')!,
      store,
      collection,
      {
        kind: 'favorites',
        label: 'Favorite colors',
        classes: { item: 'workflow-swatch' },
      },
    );
    cleanup.push(recent.destroy, favorites.destroy);
    listenButton(host, 'remember', () =>
      collection.remember(store.getSnapshot().value),
    );
    listenButton(host, 'favorite', () =>
      collection.toggleFavorite(store.getSnapshot().value),
    );
    listenButton(host, 'clear', collection.clearRecent);
    const update = () =>
      output(host, JSON.stringify(collection.getSnapshot(), null, 2));
    subscribe(collection, update);
    update();
  } else if (id === 'contrast') {
    controls.innerHTML =
      '<label class="workflow-field">Background<input type="color" data-background value="#ffffff"></label>' +
      field(
        'Text size',
        'text',
        '<option value="normal">Normal</option><option value="large">Large</option>',
      ) +
      '<article data-text-sample>Text on the selected background</article>' +
      actions(button('suggest', 'Use suggested foreground'));
    const background =
        host.querySelector<HTMLInputElement>('[data-background]')!,
      text = host.querySelector<HTMLSelectElement>('[data-text]')!;
    const result = () =>
      colorContrast(store.getSnapshot().value, background.value, {
        text: text.value as 'normal' | 'large',
      });
    const update = () => {
      const c = result(),
        sample = host.querySelector<HTMLElement>('[data-text-sample]')!;
      sample.style.color = store.getSnapshot().value;
      sample.style.background = background.value;
      output(
        host,
        `Contrast ${c.ratio.toFixed(2)}:1\nAA ${c.aa ? 'passes' : 'fails'}\nAAA ${c.aaa ? 'passes' : 'fails'}\nSuggested foreground ${c.suggestedForeground}`,
      );
    };
    background.oninput = update;
    text.onchange = update;
    listenButton(host, 'suggest', () =>
      store.setHex(result().suggestedForeground),
    );
    subscribe(store, update);
    update();
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
