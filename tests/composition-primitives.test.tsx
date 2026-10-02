// @vitest-environment jsdom
import { act, StrictMode, createRef } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import {
  ColorPicker,
  createColorStore,
  bindColorValueInput,
  subscribeColorSelector,
} from '@salyra-ui/color-picker/react';
import {
  ThemeStudio,
  createThemeStore,
  generateTheme,
  themeConfiguration,
  themeColor,
  createThemePickerStore,
} from '@salyra-ui/theme-studio/react';
import { mountColorControls } from '@salyra-ui/color-picker/vanilla';
import { mountThemeControls } from '@salyra-ui/theme-studio/vanilla';
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
describe('v1 composable primitives', () => {
  it('hydrates context-only roots, preserves native attributes and exposes the actual control ref', async () => {
    const store = createColorStore('#5268E080'),
      ref = createRef<HTMLInputElement>();
    const ui = (
      <StrictMode>
        <ColorPicker.Root store={store}>
          <article className="own-layout">
            <ColorPicker.Wheel style={{ width: 210 }}>
              <ColorPicker.Thumb
                className="own-thumb"
                style={{ borderRadius: 2 }}
              >
                Pick
              </ColorPicker.Thumb>
            </ColorPicker.Wheel>
            <ColorPicker.Input
              ref={ref}
              name="brand"
              id="brand-color"
              aria-describedby="brand-help"
              data-user="yes"
              style={{ borderColor: 'red' }}
            />
            <ColorPicker.FormatTrigger>
              My format button
            </ColorPicker.FormatTrigger>
          </article>
        </ColorPicker.Root>
      </StrictMode>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    expect(container.querySelector('fieldset')).toBeNull();
    expect(container.querySelector('article')?.children).toHaveLength(3);
    const errors = vi.fn();
    let root!: ReturnType<typeof hydrateRoot>;
    await act(() => {
      root = hydrateRoot(container, ui, { onRecoverableError: errors });
    });
    expect(errors).not.toHaveBeenCalled();
    expect(ref.current).toBe(container.querySelector('input'));
    expect(ref.current!.getAttribute('aria-describedby')).toBe('brand-help');
    expect(ref.current!.style.borderColor).toBe('red');
    const input = ref.current!;
    input.focus();
    input.value = '#123';
    await act(() => input.dispatchEvent(new Event('input', { bubbles: true })));
    expect(store.getSnapshot().value).toBe('#112233');
    expect(input.value).toBe('#123');
    input.value = '#12';
    await act(() => input.dispatchEvent(new Event('input', { bubbles: true })));
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(store.getSnapshot().value).toBe('#112233');
    input.blur();
    expect(input.value).toBe('#112233');
    await act(() => store.setDisabled(true));
    expect(input.disabled).toBe(true);
    await act(() => store.setDisabled(false));
    expect(input.disabled).toBe(false);
    await act(() => root.unmount());
    container.remove();
  });
  it('renders the current request store and explicitly disabled controls during SSR', () => {
    const color = createColorStore('#5268E0');
    color.setHex('#123456');
    const html = renderToString(
      <ColorPicker.Root store={color} disabled>
        <ColorPicker.Input />
        <ColorPicker.FormatTrigger>Format</ColorPicker.FormatTrigger>
      </ColorPicker.Root>,
    );
    expect(html).toContain('value="#123456"');
    expect(html.match(/disabled=""/g)).toHaveLength(2);
    const theme = createThemeStore({ modeStorage: false });
    theme.setName('Request theme');
    const preview = renderToString(
      <ThemeStudio.Root store={theme}>
        <ThemeStudio.Scope>
          <ThemeStudio.PickerRoot roles={['primary']}>
            <ColorPicker.Input />
          </ThemeStudio.PickerRoot>
        </ThemeStudio.Scope>
      </ThemeStudio.Root>,
    );
    expect(preview).toContain(`data-theme="${theme.getSnapshot().theme.id}"`);
  });
  it('honors preventDefault on format triggers and keeps consumer content', async () => {
    const store = createColorStore(),
      container = document.createElement('div'),
      root = createRoot(container);
    await act(() =>
      root.render(
        <ColorPicker.Root store={store}>
          <ColorPicker.FormatTrigger onClick={(e) => e.preventDefault()}>
            Custom content
          </ColorPicker.FormatTrigger>
        </ColorPicker.Root>,
      ),
    );
    await act(() => container.querySelector('button')!.click());
    expect(store.getSnapshot().format).toBe('hex');
    expect(container.textContent).toBe('Custom content');
    await act(() => root.unmount());
  });
  it('isolates mounted roles and geometry, switches roles without moving either color and cleans registrations', async () => {
    const store = createThemeStore({
        theme: generateTheme('#5268E0'),
        modeStorage: false,
      }),
      container = document.createElement('div'),
      root = createRoot(container);
    await act(() =>
      root.render(
        <ThemeStudio.Root store={store}>
          <ThemeStudio.Scope className="own-scope">
            <ThemeStudio.PickerRoot roles={['primary', 'accent']}>
              <ThemeStudio.RoleTrigger role="primary">
                Brand
              </ThemeStudio.RoleTrigger>
              <ThemeStudio.RoleTrigger role="accent">
                Highlight
              </ThemeStudio.RoleTrigger>
              <ThemeStudio.Wheel className="my-wheel" />
              <ColorPicker.Input format="hex" />
              <ThemeStudio.GeometryInput kind="radius" target="card" />
              <ThemeStudio.GeometryInput kind="width" target="button" />
            </ThemeStudio.PickerRoot>
          </ThemeStudio.Scope>
        </ThemeStudio.Root>,
      ),
    );
    const before = store.getSnapshot().theme;
    await act(() =>
      container
        .querySelectorAll<HTMLButtonElement>('[data-tk-part="role-trigger"]')[1]
        .click(),
    );
    expect(store.getSnapshot().theme).toBe(before);
    const input = container.querySelector<HTMLInputElement>(
      '[data-cp-part="input"]',
    )!;
    input.value = '#123456';
    await act(() => input.dispatchEvent(new Event('input', { bubbles: true })));
    expect(themeColor(store.getSnapshot().theme, 'accent')).toBe('#123456');
    expect(themeColor(store.getSnapshot().theme, 'primary')).toBe(
      themeColor(before, 'primary'),
    );
    const output = themeConfiguration(store.getSnapshot());
    expect(Object.keys(output.theme.structure.userPreset!)).toEqual([
      'primary',
      'accent',
    ]);
    expect(output.theme.structure.websitePreset!.border).toEqual({
      radius: { card: 0.5 },
      width: { button: 1 },
    });
    expect(container.querySelectorAll('fieldset')).toHaveLength(0);
    await act(() => root.unmount());
    expect(store.getSnapshot().selection).toBeUndefined();
  });
  it('mounts on arbitrary native DOM without changing labels, markup or decoration', () => {
    const root = document.createElement('section');
    root.innerHTML =
      '<label>Brand<input data-cp-control="input" data-format="rgb" data-index="0" class="my-input" style="border-radius:9px" /></label><button data-cp-control="format">Custom</button>';
    const original = root.innerHTML,
      store = createColorStore('#12345680'),
      mounted = mountColorControls(root, store),
      input = root.querySelector('input')!;
    expect(root.querySelector('label')!.childNodes[0].textContent).toBe(
      'Brand',
    );
    expect(input.style.borderRadius).toBe('9px');
    input.value = '200';
    input.dispatchEvent(new Event('input'));
    expect(store.getSnapshot().value).toBe('#C8345680');
    mounted.destroy();
    input.value = '100';
    input.dispatchEvent(new Event('input'));
    expect(store.getSnapshot().value).toBe('#C8345680');
    expect(root.querySelectorAll('input')).toHaveLength(1);
    expect(root.querySelector('button')!.textContent).toBe('Custom');
  });
  it('rejects invalid channel configuration, avoids unrelated selector updates, and supports dynamic picker disabling', () => {
    const store = createColorStore(),
      input = document.createElement('input');
    expect(() =>
      bindColorValueInput(input, store, { format: 'hex', index: 0 }),
    ).toThrow();
    const listener = vi.fn(),
      stop = subscribeColorSelector(store, (s) => s.alpha, listener);
    store.setFormat('rgb');
    store.setHSV({ h: 30 });
    expect(listener).not.toHaveBeenCalled();
    store.setAlpha(0.5);
    expect(listener).toHaveBeenCalledOnce();
    stop();
    const picker = createThemePickerStore(createThemeStore());
    picker.setDisabled(true);
    expect(picker.activeColor.getSnapshot().disabled).toBe(true);
    picker.selectRole('accent');
    expect(picker.activeColor.getSnapshot().disabled).toBe(true);
    picker.setDisabled(false);
    expect(picker.activeColor.getSnapshot().disabled).toBe(false);
  });
  it('registers only native geometry controls that actually exist', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<input type="number" data-tk-control="geometry" data-kind="radius" data-target="card"><input data-cp-control="input" data-format="hex">';
    const store = createThemeStore({ modeStorage: false }),
      mounted = mountThemeControls(root, store, { roles: ['primary'] });
    expect(store.getSnapshot().selection).toMatchObject({
      roles: ['primary'],
      radius: ['card'],
    });
    const config = mounted.getConfiguration();
    expect(Object.keys(config.theme.structure.userPreset!)).toEqual([
      'primary',
    ]);
    expect(config.theme.structure.websitePreset!.border).toEqual({
      radius: { card: 0.5 },
    });
    mounted.destroy();
    expect(store.getSnapshot().selection).toBeUndefined();
  });
  it('preserves local disabled controls when an initially disabled theme becomes enabled', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<button data-tk-control="role" data-role="primary">Brand</button><input type="number" data-tk-control="geometry" data-kind="radius" data-target="card"><input disabled data-cp-control="input" data-format="hex">';
    const store = createThemeStore({ disabled: true, modeStorage: false });
    const controls = mountThemeControls(root, store, { roles: ['primary'] });
    expect(root.querySelector('button')!.disabled).toBe(true);
    store.setDisabled(false);
    expect(root.querySelector('button')!.disabled).toBe(false);
    expect(
      root.querySelector<HTMLInputElement>('[data-tk-control="geometry"]')!
        .disabled,
    ).toBe(false);
    expect(
      root.querySelector<HTMLInputElement>('[data-cp-control="input"]')!
        .disabled,
    ).toBe(true);
    controls.destroy();
  });
  it('reconciles late Astro controls without remounting for unrelated text updates', async () => {
    const provider = document.createElement('tk-provider') as HTMLElement & {
      store: ReturnType<typeof createThemeStore>;
    };
    const store = createThemeStore({ modeStorage: false });
    provider.store = store;
    const composition = document.createElement('tk-compose');
    composition.dataset.options = JSON.stringify({ roles: ['primary'] });
    provider.append(composition);
    document.body.append(provider);
    composition.innerHTML =
      '<input data-cp-control="input" data-format="hex"><output></output>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = composition.querySelector('input')!;
    expect(input.value).toBe(themeColor(store.getSnapshot().theme, 'primary'));
    input.focus();
    input.value = '#12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    composition.querySelector('output')!.textContent = 'Changed';
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(input.value).toBe('#12');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    provider.remove();
    expect(store.getSnapshot().selection).toBeUndefined();
  });
  it('enables controls after a disabled declarative root is enabled', async () => {
    const provider = document.createElement('cp-provider') as HTMLElement & {
      store: ReturnType<typeof createColorStore>;
    };
    provider.setAttribute('disabled', '');
    provider.innerHTML =
      '<cp-compose><input data-cp-control="input"><button data-cp-control="format">Next</button></cp-compose>';
    document.body.append(provider);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(provider.querySelector('input')!.disabled).toBe(true);
    provider.removeAttribute('disabled');
    expect(provider.querySelector('input')!.disabled).toBe(false);
    expect(provider.querySelector('button')!.disabled).toBe(false);
    provider.remove();
  });
});
