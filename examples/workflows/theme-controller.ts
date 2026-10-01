import {
  createThemeStore,
  createThemeEditor,
  generateTheme,
  themeConfiguration,
  themeColor,
  createThemeCollection,
  browserThemeCollectionStorage,
} from '@salyra-ui/theme-studio';
import {
  mountHistory,
  colorContrast,
  channelsToHex,
} from '@salyra-ui/color-picker';

export function createDemo() {
  const target = createThemeStore({
    theme: generateTheme('#5268E0'),
    mode: 'light',
    modeStorage: false,
  });
  const editor = createThemeEditor(target);
  const collection = createThemeCollection({
    storage: browserThemeCollectionStorage('example:themes'),
    favorites: [target.getSnapshot().theme],
  });
  const read = () => {
    const draft = editor.store.getSnapshot();
    const primary = draft.theme.structure.userPreset.primary;
    return {
      collection: collection.getSnapshot(),
      session: editor.getSnapshot(),
      history: editor.history.getSnapshot(),
      contrast: colorContrast(
        channelsToHex(primary.foreground),
        themeColor(draft.theme, 'primary'),
      ),
      tailwind: themeConfiguration(draft).tailwind,
    };
  };
  let state = read();
  const listeners = new Set<() => void>();
  const update = () => {
    state = read();
    listeners.forEach((fn) => fn());
  };
  const stops = [
    target.subscribe(update),
    editor.store.subscribe(update),
    editor.subscribe(update),
    editor.history.subscribe(update),
    collection.subscribe(update),
  ];
  return {
    target,
    editor,
    collection,
    apply() {
      editor.apply();
      collection.remember(target.getSnapshot().theme);
    },
    getSnapshot: () => state,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    mount(root: HTMLElement) {
      collection.load();
      return mountHistory(root, editor.history);
    },
    destroy() {
      stops.forEach((stop) => stop());
      editor.destroy();
      listeners.clear();
    },
  };
}
