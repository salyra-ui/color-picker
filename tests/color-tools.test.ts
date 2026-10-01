import { it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  createColorStore,
  createColorHistory,
  colorContrast,
  compositeColor,
  createColorCollection,
  bindColorForm,
  mountHistory,
} from '@salyra-ui/color-picker';
it('restores achromatic hue and alpha without reverting format/view', () => {
  const store = createColorStore('#88888880'),
    history = createColorHistory(store, { limit: 2 });
  history.begin();
  store.setHSV({ h: 150, s: 70 });
  store.setAlpha(0.3);
  history.end();
  store.setFormat('hsl');
  store.setView('wheel');
  history.undo();
  expect(store.getSnapshot()).toMatchObject({
    value: '#88888880',
    h: 0,
    format: 'hsl',
    view: 'wheel',
  });
  history.redo();
  expect(store.getSnapshot().alpha).toBe(0.3);
  store.setHex('#111111');
  store.setHex('#222222');
  expect(history.getSnapshot().length).toBe(3);
  history.destroy();
});
it('measures rendered alpha colors and leaves correction up to the caller', () => {
  expect(compositeColor('#00000080', '#FFFFFF')).toBe('#7F7F7F');
  expect(colorContrast('#000000', '#FFFFFF')).toMatchObject({
    ratio: 21,
    aa: true,
    aaa: true,
  });
  expect(colorContrast('#00000000', '#FFFFFF')).toMatchObject({
    ratio: 1,
    aa: false,
  });
  expect(
    colorContrast('#000000', '#00000000', { canvas: '#FFFFFF' }).ratio,
  ).toBe(21);
  expect(() =>
    colorContrast('#FFFFFF', '#000000', { canvas: '#00000080' }),
  ).toThrow('opaque');
});
it('deduplicates and bounds recent colors with optional resilient persistence', () => {
  let saved: unknown;
  const collection = createColorCollection({
    limit: 2,
    storage: {
      read: () => saved,
      write: (value) => {
        saved = value;
      },
    },
  });
  collection.remember('#123');
  collection.remember('#456');
  collection.remember('#123');
  expect(collection.getSnapshot().recent).toEqual(['#112233', '#445566']);
  collection.toggleFavorite('#123');
  collection.toggleFavorite('#123');
  expect(collection.getSnapshot().favorites).toEqual([]);
  const restored = createColorCollection({
    storage: { read: () => saved, write() {} },
  });
  restored.load();
  expect(restored.getSnapshot().recent).toEqual(
    collection.getSnapshot().recent,
  );
  const corrupt = createColorCollection({
    favorites: ['#FFF'],
    storage: {
      read: () => ({ recent: ['not-a-color'], favorites: [] }),
      write() {
        throw Error('quota');
      },
    },
  });
  corrupt.load();
  expect(corrupt.getSnapshot().favorites).toEqual(['#FFFFFF']);
  corrupt.remember('#000');
});
it('submits a real form value, excludes disabled values and resets to the starting color', async () => {
  const dom = new JSDOM('<form><div id="picker"></div></form>');
  const root = dom.window.document.querySelector<HTMLElement>('#picker')!,
    form = dom.window.document.querySelector('form')!;
  const store = createColorStore('#12345680');
  const bound = bindColorForm(root, store, {
    name: 'brand',
    format: 'hex',
    validate: (value) =>
      value === '#000000' ? 'Choose another color' : undefined,
  });
  expect(new dom.window.FormData(form).get('brand')).toBe('#12345680');
  store.setHex('#000000');
  expect(form.checkValidity()).toBe(false);
  store.setDisabled(true);
  expect(new dom.window.FormData(form).has('brand')).toBe(false);
  store.setDisabled(false);
  form.reset();
  await new Promise((resolve) => setTimeout(resolve, 1));
  expect(store.getSnapshot().value).toBe('#12345680');
  form.addEventListener('reset', (e) => e.preventDefault(), { once: true });
  store.setHex('#FFFFFF');
  form.reset();
  await new Promise((resolve) => setTimeout(resolve, 1));
  expect(store.getSnapshot().value).toBe('#FFFFFF');
  bound.destroy();
  expect(root.children.length).toBe(0);
  dom.window.close();
});
it('groups a full pointer gesture and detaches document listeners on cleanup', () => {
  const dom = new JSDOM('<div id="root"></div>'),
    root = dom.window.document.querySelector<HTMLElement>('#root')!;
  const store = createColorStore(),
    history = createColorHistory(store),
    detach = mountHistory(root, history);
  const event = (type: string) => {
    const e = new dom.window.Event(type, { bubbles: true });
    Object.assign(e, { button: 0, pointerId: 1 });
    return e;
  };
  root.dispatchEvent(event('pointerdown'));
  store.setHex('#123456');
  store.setHex('#654321');
  root.dispatchEvent(event('pointerup'));
  expect(history.getSnapshot().length).toBe(2);
  detach();
  history.undo();
  expect(store.getSnapshot().value).toBe('#6366F1');
  history.destroy();
  dom.window.close();
});
