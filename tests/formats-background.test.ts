import { describe, it, expect, vi } from 'vitest';
import {
  getColorChannels,
  setColorChannel,
  colorFormats,
  parseColor,
  formatColor,
  hexToOklch,
  oklchToHex,
  createColorStore,
  subscribeColor,
  contrast,
  channelsToHex,
} from '@sebytza23/color-picker';
import {
  generateTheme,
  createThemeStore,
  withThemeBackground,
  fromLegacyTheme,
  toLegacyTheme,
} from '@sebytza23/theme-kit';
describe('formats', () => {
  it.each(colorFormats)('round trips sRGB samples through %s', (format) => {
    for (const hex of [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#123456',
      '#EF6B52',
      '#6366F1',
    ])
      expect(parseColor(formatColor(hex, format), format)).toBe(hex);
  });
  it('matches the Oklab red reference', () => {
    const color = hexToOklch('#FF0000');
    expect(color.l).toBeCloseTo(0.627955, 5);
    expect(color.c).toBeCloseTo(0.257683, 5);
    expect(color.h).toBeCloseTo(29.2339, 3);
  });
  it('accepts percentages and gamut maps high-chroma OKLCH', () => {
    expect(parseColor('oklch(62.7955% 0.257683 29.2339)', 'oklch')).toBe(
      '#FF0000',
    );
    expect(oklchToHex({ l: 0.5, c: 0.8, h: 280 })).toMatch(/^#[A-F\d]{6}$/);
    expect(() => parseColor('oklch(2 0.1 20)', 'oklch')).toThrow();
  });
  it('switches formats without emitting color changes', () => {
    const store = createColorStore('#123456'),
      changed = vi.fn(),
      unsubscribe = subscribeColor(store, changed);
    store.setFormat('oklch');
    store.setFormat('rgb');
    expect(store.getSnapshot().hex).toBe('#123456');
    expect(changed).not.toHaveBeenCalled();
    store.setHex('#ffffff');
    expect(changed).toHaveBeenCalledExactlyOnceWith('#FFFFFF');
    unsubscribe();
  });
});
describe('background generation', () => {
  it('generates optional tinted surfaces in both modes with readable text', () => {
    for (const seed of [
      '#6366F1',
      '#EF4444',
      '#00FF00',
      '#000000',
      '#FFFFFF',
    ]) {
      const neutral = generateTheme(seed),
        tinted = generateTheme(seed, { background: 'tinted' });
      for (const mode of ['light', 'dark'] as const) {
        const { foreground, background } = tinted.structure.websitePreset;
        expect(
          contrast(
            channelsToHex(foreground[mode]),
            channelsToHex(background[mode]),
          ),
        ).toBeGreaterThan(7);
      }
      expect(neutral.backgroundMode).toBe('neutral');
      expect(tinted.backgroundMode).toBe('tinted');
    }
  });
  it('changes hue with primary and retains the mode while generating', () => {
    const theme = generateTheme('#EF4444', { background: 'tinted' }),
      store = createThemeStore({ theme });
    store.generate('#6366F1');
    expect(store.getSnapshot().background).toBe('tinted');
    expect(
      store.getSnapshot().theme.structure.websitePreset.background,
    ).not.toEqual(theme.structure.websitePreset.background);
    store.setBackground('neutral');
    expect(
      store.getSnapshot().theme.structure.websitePreset.background.dark,
    ).toBe('0 0% 8%');
  });
  it('keeps imported custom surfaces until explicitly regenerated', () => {
    const custom = fromLegacyTheme(
      toLegacyTheme(generateTheme('#123456', { background: 'tinted' })),
    );
    const next = generateTheme('#EF4444', { base: custom });
    expect(next.structure.websitePreset).toEqual(
      custom.structure.websitePreset,
    );
    expect(
      withThemeBackground(custom, 'neutral').structure.websitePreset.background,
    ).not.toEqual(custom.structure.websitePreset.background);
  });
});

describe('individual channel editing', () => {
  it('updates one RGB component without changing the others', () => {
    const store = createColorStore('#123456');
    setColorChannel(store, 'rgb', 1, 100);
    expect(store.getSnapshot().hex).toBe('#126456');
  });
  it('preserves HSV hue while editing a black color', () => {
    const store = createColorStore('#000000');
    setColorChannel(store, 'hsv', 0, 120);
    setColorChannel(store, 'hsv', 1, 100);
    setColorChannel(store, 'hsv', 2, 100);
    expect(store.getSnapshot().hex).toBe('#00FF00');
  });
  it.each(['hsl', 'hsv', 'oklch', 'oklab'] as const)(
    'edits %s using the correct units',
    (format) => {
      const store = createColorStore('#6366F1');
      const before = store.getSnapshot().hex;
      const values = getColorChannels(store.getSnapshot(), format);
      setColorChannel(store, format, 0, values[0] * 0.8);
      expect(store.getSnapshot().hex).not.toBe(before);
    },
  );
  it('rejects incomplete and out-of-range channel values', () => {
    const store = createColorStore();
    expect(() => setColorChannel(store, 'rgb', 0, 256)).toThrow();
    expect(() => setColorChannel(store, 'oklch', 0, 101)).toThrow();
    expect(() => setColorChannel(store, 'hsl', 1, NaN)).toThrow();
  });
});
