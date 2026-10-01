import {
  createColorStore,
  createColorHistory,
  createColorCollection,
  browserColorStorage,
  bindColorForm,
  mountHistory,
  colorContrast,
} from '@salyra-ui/color-picker';

export function createDemo() {
  const store = createColorStore('#5268E080');
  const history = createColorHistory(store);
  const collection = createColorCollection({
    storage: browserColorStorage('example:colors'),
    favorites: ['#5268E0', '#277D59', '#C25D3D'],
  });
  let submitted = '';
  const read = () => ({
    color: store.getSnapshot(),
    history: history.getSnapshot(),
    collection: collection.getSnapshot(),
    contrast: colorContrast(store.getSnapshot().value, '#FFFFFF'),
    submitted,
  });
  let state = read();
  const listeners = new Set<() => void>();
  const update = () => {
    state = read();
    listeners.forEach((fn) => fn());
  };
  const stops = [
    store.subscribe(update),
    history.subscribe(update),
    collection.subscribe(update),
  ];
  return {
    store,
    history,
    collection,
    getSnapshot: () => state,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    submit(form: HTMLFormElement) {
      submitted = JSON.stringify(
        Object.fromEntries(new FormData(form)),
        null,
        2,
      );
      update();
    },
    mount(form: HTMLFormElement) {
      collection.load();
      const field = bindColorForm(form, store, {
        name: 'brandColor',
        format: 'hex',
        required: true,
      });
      const detach = mountHistory(form, history);
      return () => {
        field.destroy();
        detach();
      };
    },
    destroy() {
      stops.forEach((stop) => stop());
      history.destroy();
      listeners.clear();
    },
  };
}
