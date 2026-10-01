// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import {
  mountColorPicker,
  type ColorProviderElement,
} from '@salyra-ui/color-picker/vanilla';
import {
  mountThemeKit,
  themePaletteMarkup,
  themeConfiguration,
  themePickerMarkup,
  generateTheme,
  createThemeStore,
  type ThemeProviderElement,
} from '@salyra-ui/theme-studio/vanilla';
describe('native HTML adapters', () => {
  it('initializes a declarative picker when its children arrive after the parent connects', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    host.innerHTML = `<tk-provider data-config='{"modeStorage":false}'><tk-picker></tk-picker></tk-provider>`;
    const picker = host.querySelector('tk-picker')!;
    picker.innerHTML = themePickerMarkup
      .replace('<tk-picker>', '')
      .replace('</tk-picker>', '');
    await Promise.resolve();
    expect(picker.querySelectorAll('[data-marker-id]')).toHaveLength(3);
    const provider = host.querySelector('tk-provider') as ThemeProviderElement;
    provider.store!.setColor('primary', '#ff0000');
    expect(
      (picker.querySelector('cp-input input') as HTMLInputElement).value,
    ).toBe('#FF0000');
    host.remove();
  });
  it('returns color names, all formats and alpha with separate RGB fields', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const change = vi.fn(),
      picker = mountColorPicker(host, {
        value: '#12345680',
        format: 'rgb',
        onChange: change,
      });
    expect(picker.getColor().name).toBe('Prussian Blue');
    expect(picker.getValue('hsl').alpha).toBeCloseTo(128 / 255);
    expect(host.querySelectorAll('.cp-channels input')).toHaveLength(3);
    picker.store.setHex('#ff0000');
    expect(change.mock.calls.at(-1)?.[0].hex).toBe('#FF0000');
    expect(host.querySelector('cp-output output')?.textContent).toBe(
      picker.getColor().name,
    );
    picker.destroy();
    expect(host.children).toHaveLength(0);
    host.remove();
  });
  it('applies list selections, custom names, modes and full export through one native provider', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const themes = [generateTheme('#6366f1'), generateTheme('#277d59')],
      change = vi.fn();
    const kit = mountThemeKit(host, {
      theme: themes[0],
      themes,
      modeStorage: false,
      picker: { view: 'shared-wheel' },
      onChange: change,
    });
    const select = host.querySelector('tk-select select') as HTMLSelectElement;
    select.value = themes[1].id;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(kit.store.getSnapshot().theme).toEqual(themes[1]);
    (host.querySelector('[data-tk-mode="dark"]') as HTMLButtonElement).click();
    const input = host.querySelector('[data-tk-name]') as HTMLInputElement;
    input.value = 'My native theme';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(kit.getConfiguration().modePreference).toBe('dark');
    expect(kit.getConfiguration().theme.name).toBe('My native theme');
    expect(host.querySelectorAll('[data-marker-id]')).toHaveLength(3);
    expect(change.mock.calls.at(-1)?.[0].theme.name).toBe('My native theme');
    await Promise.resolve();
    kit.destroy();
    host.remove();
  });
  it('exports only mounted role and border fields and preserves them when disabled', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const kit = mountThemeKit(host, {
      theme: generateTheme('#5268e0'),
      modeStorage: false,
      picker: { roles: ['primary'], view: 'wheel' },
      radius: ['card'],
      width: ['button'],
      backgroundControl: false,
    });
    await Promise.resolve();
    let saved = JSON.parse(kit.getConfiguration().json);
    expect(Object.keys(saved.theme.structure.userPreset)).toEqual(['primary']);
    expect(saved.theme.structure.websitePreset.border).toEqual({
      radius: { card: 0.5 },
      width: { button: 1 },
    });
    kit.store.setDisabled(true);
    await Promise.resolve();
    expect(kit.element.hasAttribute('inert')).toBe(true);
    expect(
      [...kit.element.querySelectorAll<HTMLInputElement>('input')].every(
        (input) => input.disabled,
      ),
    ).toBe(true);
    expect(kit.getConfiguration().json).toBe(JSON.stringify(saved, null, 2));
    kit.store.setColor('primary', '#ff0000');
    expect(kit.getConfiguration().tokens['--primary']).toBe('0 100% 50%');
    kit.store.setDisabled(false);
    await Promise.resolve();
    expect(kit.element.hasAttribute('inert')).toBe(false);
    expect(
      (kit.element.querySelector('[data-tk-border]') as HTMLInputElement)
        .disabled,
    ).toBe(false);
    kit.destroy();
    host.remove();
  });
  it('updates native swatch colors while keeping custom labels, shape and classes', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const kit = mountThemeKit(host, {
      theme: generateTheme('#f00'),
      modeStorage: false,
    });
    kit.element.insertAdjacentHTML(
      'beforeend',
      themePaletteMarkup('primary', {
        shape: 'circle',
        classes: { root: 'brand', label: 'shade-label' },
        labels: { 500: 'Main shade' },
      }),
    );
    const swatch =
        kit.element.querySelector<HTMLElement>('[data-shade="500"]')!,
      before = swatch.style.background;
    kit.store.setColor('primary', '#0f0');
    expect(swatch.style.background).not.toBe(before);
    expect(swatch.closest('.brand')?.getAttribute('data-shape')).toBe('circle');
    expect(
      swatch.parentElement!.querySelector('.shade-label')!.textContent,
    ).toBe('Main shade');
    kit.destroy();
    host.remove();
  });
  it('preserves custom ColorMode content while synchronizing the current format', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const picker = mountColorPicker(host, { value: '#123456', disabled: true });
    const mode = picker.element.querySelector('cp-mode')!;
    mode.remove();
    mode.setAttribute('data-custom', '');
    mode.innerHTML =
      '<button type="button">Use <span data-color-format></span> next</button>';
    picker.element.append(mode);
    expect(mode.querySelector('button')!.textContent).toBe('Use HEX next');
    picker.store.setDisabled(false);
    picker.store.setFormat('rgb');
    expect(mode.querySelector('button')!.textContent).toBe('Use RGB next');
    picker.destroy();
    host.remove();
  });
  it('cleans up swapped HTML fragments and reconnects without duplicate handlers', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const kit = mountThemeKit(host, { modeStorage: false });
    const provider = kit.element,
      store = kit.store,
      setMode = vi.spyOn(store, 'setMode'),
      stop = vi.spyOn(store, 'stop');
    provider.remove();
    expect(stop).toHaveBeenCalledTimes(1);
    host.append(provider);
    (
      provider.querySelector('[data-tk-mode="dark"]') as HTMLButtonElement
    ).click();
    expect(setMode).toHaveBeenCalledTimes(1);
    const replacement = createThemeStore({ theme: generateTheme('#f00') });
    provider.setStore(replacement, { modeStorage: false });
    expect(
      provider
        .querySelector('[data-select-role="primary"] span')
        ?.getAttribute('style'),
    ).toContain('rgb(255, 0, 0)');
    await Promise.resolve();
    kit.destroy();
    host.remove();
  });
});
