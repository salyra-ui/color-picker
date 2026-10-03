import { it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  createColorStore,
  createColorEyeDropper,
  bindColorEyeDropper,
  isEyeDropperSupported,
  type EyeDropperHost,
} from '@salyra-ui/color-picker';

function screen() {
  let resolve!: (result: { sRGBHex: string }) => void;
  let reject!: (error: Error) => void;
  let signal!: AbortSignal;
  let calls = 0;
  const host: EyeDropperHost = {
    isSecureContext: true,
    EyeDropper: class {
      open(options: { signal: AbortSignal }) {
        calls++;
        signal = options.signal;
        return new Promise<{ sRGBHex: string }>((yes, no) => {
          resolve = yes;
          reject = no;
        });
      }
    },
  };
  return {
    host,
    resolve: (hex: string) => resolve({ sRGBHex: hex }),
    reject: (error: Error) => reject(error),
    calls: () => calls,
    signal: () => signal,
  };
}
it('starts from SSR-safe state and feature detects secure contexts on mount', () => {
  const mock = screen();
  const eye = createColorEyeDropper(createColorStore('#123456'), mock.host);
  expect(eye.getSnapshot()).toMatchObject({ supported: false, pending: false });
  eye.mount();
  expect(eye.getSnapshot().supported).toBe(true);
  expect(isEyeDropperSupported({ ...mock.host, isSecureContext: false })).toBe(
    false,
  );
  expect(isEyeDropperSupported({})).toBe(false);
  eye.destroy();
});
it('opens synchronously, ignores duplicate requests, preserves alpha and editing mode', async () => {
  const mock = screen(),
    store = createColorStore('#5268E080');
  store.setFormat('hsl');
  store.setView('wheel');
  const eye = createColorEyeDropper(store, mock.host);
  eye.mount();
  const request = eye.pick();
  expect(mock.calls()).toBe(1);
  expect(eye.getSnapshot().pending).toBe(true);
  expect(await eye.pick()).toBeUndefined();
  mock.resolve('#abcdef');
  expect(await request).toBe('#ABCDEF');
  expect(store.getSnapshot()).toMatchObject({
    value: '#ABCDEF80',
    format: 'hsl',
    view: 'wheel',
  });
  const opaque = eye.pick({ preserveAlpha: false });
  mock.resolve('#123456');
  await opaque;
  expect(store.getSnapshot()).toMatchObject({ value: '#123456', alpha: 1 });
  expect(eye.getSnapshot().pending).toBe(false);
  eye.destroy();
});
it('treats Escape as cancellation and retains genuine errors without changing the color', async () => {
  const mock = screen(),
    store = createColorStore('#123456'),
    eye = createColorEyeDropper(store, mock.host);
  eye.mount();
  const cancelled = eye.pick();
  mock.reject(Object.assign(new Error('Cancelled'), { name: 'AbortError' }));
  expect(await cancelled).toBeUndefined();
  expect(eye.getSnapshot().error).toBeUndefined();
  const bad = eye.pick();
  mock.resolve('bad color');
  await expect(bad).rejects.toThrow('Invalid screen color');
  expect(eye.getSnapshot()).toMatchObject({
    pending: false,
    error: expect.any(TypeError),
  });
  expect(store.getSnapshot().value).toBe('#123456');
  eye.destroy();
});
for (const action of ['cancel', 'disable', 'destroy'] as const) {
  it(`${action} aborts the operation and ignores a late screen response`, async () => {
    const mock = screen(),
      store = createColorStore('#123456'),
      eye = createColorEyeDropper(store, mock.host);
    eye.mount();
    const request = eye.pick();
    if (action === 'disable') store.setDisabled(true);
    else eye[action]();
    expect(mock.signal().aborted).toBe(true);
    expect(eye.getSnapshot().pending).toBe(false);
    mock.resolve('#FFFFFF');
    expect(await request).toBeUndefined();
    expect(store.getSnapshot().value).toBe('#123456');
    eye.destroy();
  });
}
it('rejects unsupported sampling and does not invoke it for disabled stores', async () => {
  const store = createColorStore('#123456'),
    eye = createColorEyeDropper(store, {});
  await expect(eye.pick()).rejects.toMatchObject({ name: 'NotSupportedError' });
  store.setDisabled(true);
  expect(await eye.pick()).toBeUndefined();
  eye.destroy();
});
it('binds to user markup in its own document and removes all behavior on disposal', async () => {
  const dom = new JSDOM('<button class="pipette"><span>Sample</span></button>');
  const mock = screen();
  Object.assign(dom.window, mock.host);
  const button = dom.window.document.querySelector('button')!;
  const store = createColorStore('#12345680');
  const picked: string[] = [];
  button.addEventListener('color-pick', (event) =>
    picked.push((event as CustomEvent).detail.hex),
  );
  const binding = bindColorEyeDropper(button, store);
  expect(button.disabled).toBe(false);
  expect(button.className).toBe('pipette');
  expect(button.innerHTML).toBe('<span>Sample</span>');
  button.click();
  expect(button.disabled).toBe(true);
  mock.resolve('#abcdef');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(picked).toEqual(['#ABCDEF']);
  expect(store.getSnapshot().value).toBe('#ABCDEF80');
  button.click();
  binding.destroy();
  mock.resolve('#FFFFFF');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(picked).toHaveLength(1);
  button.click();
  expect(mock.calls()).toBe(2);
  dom.window.close();
});
it('respects a pre-existing disabled button', () => {
  const dom = new JSDOM('<button disabled>Sample</button>');
  const mock = screen();
  Object.assign(dom.window, mock.host);
  const button = dom.window.document.querySelector('button')!;
  const store = createColorStore('#123456');
  const binding = bindColorEyeDropper(button, store, { disabled: () => false });
  expect(button.disabled).toBe(true);
  button.click();
  expect(mock.calls()).toBe(0);
  binding.destroy();
  expect(button.disabled).toBe(true);
  dom.window.close();
});

it('cancels a DOM binding when the owner disables it while sampling', async () => {
  const dom = new JSDOM('<button>Sample</button>'),
    mock = screen();
  Object.assign(dom.window, mock.host);
  let disabled = false;
  const button = dom.window.document.querySelector('button')!;
  const store = createColorStore('#123456');
  const binding = bindColorEyeDropper(button, store, {
    disabled: () => disabled,
  });
  button.click();
  disabled = true;
  binding.refresh();
  expect(mock.signal().aborted).toBe(true);
  expect(button.disabled).toBe(true);
  mock.resolve('#FFFFFF');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(store.getSnapshot().value).toBe('#123456');
  binding.destroy();
  dom.window.close();
});

it('re-enables a button disabled initially by its color context', () => {
  const dom = new JSDOM('<button disabled data-cp-disabled>Sample</button>'),
    mock = screen();
  Object.assign(dom.window, mock.host);
  const store = createColorStore('#123456');
  store.setDisabled(true);
  const button = dom.window.document.querySelector('button')!;
  const binding = bindColorEyeDropper(button, store);
  expect(button.disabled).toBe(true);
  store.setDisabled(false);
  expect(button.disabled).toBe(false);
  binding.destroy();
  dom.window.close();
});
