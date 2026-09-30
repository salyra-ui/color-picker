// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { mountColorPicker, type ColorProviderElement } from '@sebytza23/color-picker-vanilla';
import { mountThemeKit, generateTheme, createThemeStore, type ThemeProviderElement } from '@sebytza23/theme-kit-vanilla';
describe('native HTML adapters', () => {
 it('returns color names, all formats and alpha with separate RGB fields', () => {
   const host = document.createElement('div'); document.body.append(host);
   const change = vi.fn(), picker = mountColorPicker(host, { value: '#12345680', format: 'rgb', onChange: change });
   expect(picker.getColor().name).toBe('Prussian Blue');
   expect(picker.getValue('hsl').alpha).toBeCloseTo(128 / 255);
   expect(host.querySelectorAll('.cp-channels input')).toHaveLength(3);
   picker.store.setHex('#ff0000');
   expect(change.mock.calls.at(-1)?.[0].hex).toBe('#FF0000');
   expect(host.querySelector('cp-output output')?.textContent).toBe(picker.getColor().name);
   picker.destroy(); expect(host.children).toHaveLength(0); host.remove();
 });
 it('applies list selections, custom names, modes and full export through one native provider', async () => {
   const host = document.createElement('div'); document.body.append(host);
   const themes = [generateTheme('#6366f1'), generateTheme('#277d59')], change = vi.fn();
   const kit = mountThemeKit(host, { theme: themes[0], themes, modeStorage: false, picker: { view: 'shared-wheel' }, onChange: change });
   const select = host.querySelector('tk-select select') as HTMLSelectElement;
   select.value = themes[1].id; select.dispatchEvent(new Event('change', { bubbles: true }));
   expect(kit.store.getSnapshot().theme).toEqual(themes[1]);
   (host.querySelector('[data-tk-mode="dark"]') as HTMLButtonElement).click();
   const input = host.querySelector('[data-tk-name]') as HTMLInputElement;
   input.value = 'My native theme'; input.dispatchEvent(new Event('input', { bubbles: true }));
   expect(kit.getConfiguration().modePreference).toBe('dark');
   expect(kit.getConfiguration().theme.name).toBe('My native theme');
   expect(host.querySelectorAll('[data-marker-id]')).toHaveLength(3);
   expect(change.mock.calls.at(-1)?.[0].theme.name).toBe('My native theme');
   await Promise.resolve(); kit.destroy(); host.remove();
 });
 it('cleans up swapped HTML fragments and reconnects without duplicate handlers', async () => {
   const host = document.createElement('div'); document.body.append(host);
   const kit = mountThemeKit(host, { modeStorage: false });
   const provider = kit.element, store = kit.store, setMode = vi.spyOn(store, 'setMode'), stop = vi.spyOn(store, 'stop');
   provider.remove(); expect(stop).toHaveBeenCalledTimes(1);
   host.append(provider); (provider.querySelector('[data-tk-mode="dark"]') as HTMLButtonElement).click();
   expect(setMode).toHaveBeenCalledTimes(1);
   const replacement = createThemeStore({ theme: generateTheme('#f00') }); provider.setStore(replacement, { modeStorage: false });
   expect(provider.querySelector('[data-select-role="primary"] span')?.getAttribute('style')).toContain('rgb(255, 0, 0)');
   await Promise.resolve(); kit.destroy(); host.remove();
 });
});
