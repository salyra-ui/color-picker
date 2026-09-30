import { describe, it, expect, vi } from 'vitest';
import {
  createColorStore,
  normalizeColorHex,
  opaqueHex,
  hexAlpha,
  parseColor,
  formatColor,
  colorFormats,
  getColor,
  setColorChannel,
  subscribeColor,
} from '@sebytza23/color-picker';
import {
  createThemeStore,
  createThemePickerStore,
  generateTheme,
  themeColor,
  themePickerMarkers,
} from '@sebytza23/theme-kit';

describe('standalone alpha', () => {
  it('normalizes CSS short and long RGBA without changing opaque normalization', () => {
    expect(normalizeColorHex('#f008')).toBe('#FF000088');
    expect(normalizeColorHex('#1234')).toBe('#11223344');
    expect(normalizeColorHex('#abcdefFF')).toBe('#ABCDEF');
    expect(opaqueHex('#12345680')).toBe('#123456');
    expect(hexAlpha('#12345680')).toBeCloseTo(128 / 255);
    expect(() => normalizeColorHex('#12345')).toThrow();
  });
  it('round trips transparent colors in every format and ignores opacity for names', () => {
    const color = getColor('#12345680');
    expect(color.name).toBe('Prussian Blue');
    expect(color.rgb.alpha).toBeCloseTo(128 / 255);
    for (const format of colorFormats)
      expect(parseColor(color.formats[format], format)).toBe('#12345680');
    expect(parseColor('rgba(255, 0, 0, 50%)', 'rgb')).toBe('#FF000080');
    expect(parseColor('hsl(0 100% 50% / 0)', 'hsl')).toBe('#FF000000');
    expect(() => parseColor('255 0 0 / 1.1', 'rgb')).toThrow();
  });
  it('preserves exact alpha when editing channels and exposes RGBA callbacks', () => {
    const store = createColorStore('#123456'),
      listener = vi.fn();
    const stop = subscribeColor(store, listener);
    store.setAlpha(0.5);
    expect(store.getSnapshot()).toMatchObject({
      hex: '#123456',
      value: '#12345680',
      alpha: 0.5,
    });
    expect(store.getValue('oklab').alpha).toBe(0.5);
    expect(store.getColor().formats.hsl).toContain('/ 0.5');
    setColorChannel(store, 'rgb', 0, 200);
    expect(store.getSnapshot().alpha).toBe(0.5);
    expect(listener).toHaveBeenLastCalledWith('#C8345680');
    const calls = listener.mock.calls.length;
    store.setFormat('hsl');
    store.setView('wheel');
    expect(listener).toHaveBeenCalledTimes(calls);
    expect(() => store.setAlpha(NaN)).toThrow();
    expect(() => store.setAlpha(-1)).toThrow();
    store.setHex('#fff');
    expect(store.getSnapshot().alpha).toBe(1);
    stop();
  });
});
describe('shared theme picker', () => {
  it('selects markers without mutation and edits only the active role', () => {
    const theme = createThemeStore({ theme: generateTheme('#6366f1') }),
      picker = createThemePickerStore(theme);
    const before = theme.getSnapshot().theme;
    picker.selectRole('accent');
    expect(theme.getSnapshot().theme).toBe(before);
    picker.activeColor.setHex('#123456');
    expect(themeColor(theme.getSnapshot().theme, 'accent')).toBe('#123456');
    expect(themeColor(theme.getSnapshot().theme, 'primary')).toBe(
      themeColor(before, 'primary'),
    );
    expect(themeColor(theme.getSnapshot().theme, 'secondary')).toBe(
      themeColor(before, 'secondary'),
    );
    picker.setView('shared-wheel');
    picker.activeColor.setHSV({ v: 0 });
    expect(picker.getSnapshot().colors.accent.h).toBeCloseTo(210);
    picker.activeColor.setHSV({ v: 100 });
    expect(themeColor(theme.getSnapshot().theme, 'accent')).not.toBe('#000000');
  });
  it('renders one anonymous dot, validates roles and retains independent formats', () => {
    const theme = createThemeStore(),
      picker = createThemePickerStore(theme);
    expect(
      themePickerMarkers(picker.getSnapshot()).map((m) => m.label),
    ).toEqual(['P', 'S', 'A']);
    picker.selectRole('accent');
    picker.activeColor.setFormat('oklch');
    picker.setRoles(['primary']);
    expect(picker.getSnapshot().activeRole).toBe('primary');
    expect(themePickerMarkers(picker.getSnapshot())[0].label).toBe('');
    expect(() => picker.setRoles([])).toThrow();
    picker.setRoles(['primary', 'accent']);
    picker.selectRole('accent');
    expect(picker.activeColor.getSnapshot().format).toBe('oklch');
  });
  it('syncs external changes while mounted and safely remounts', () => {
    const theme = createThemeStore(),
      picker = createThemePickerStore(theme);
    const stop = picker.mount();
    theme.setColor('secondary', '#abcdef');
    expect(picker.getSnapshot().colors.secondary.hex).toBe('#ABCDEF');
    stop();
    theme.setColor('secondary', '#123456');
    expect(picker.getSnapshot().colors.secondary.hex).toBe('#ABCDEF');
    const stop2 = picker.mount();
    expect(picker.getSnapshot().colors.secondary.hex).toBe('#123456');
    stop2();
  });
});
