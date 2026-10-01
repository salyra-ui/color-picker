import { describe, it, expect } from 'vitest';
import {
  colorNames,
  getColor,
  getColorValue,
  getColorNameMatch,
  createColorStore,
  parseColor,
  colorFormats,
  wheelAtPoint,
  hexToHsv,
} from '@salyra-ui/color-picker';
import {
  createThemeStore,
  generateTheme,
  generateThemeTokens,
  selectThemeTokens,
  themeVariables,
  themeColor,
  fromLegacyTheme,
  harmonyColors,
} from '@salyra-ui/theme-studio';

describe('color values and names', () => {
  it('matches names from the original color-namer 1.4.0 default lookup', () => {
    for (const [hex, name] of [
      ['#6366F1', 'Blue Ribbon'],
      ['#EF6B52', 'Bittersweet'],
      ['#123456', 'Prussian Blue'],
      ['#277D59', 'Amazon'],
      ['#FFA500', 'Web Orange'],
      ['#09ABEF', 'Picton Blue'],
      ['#ABCDEF', 'Spindle'],
    ])
      expect(getColor(hex).name).toBe(name);
  });
  it('ships the original NTC entries and distinguishes exact/nearest matches', () => {
    expect(colorNames).toHaveLength(1566);
    expect(getColorNameMatch('#f00')).toEqual({
      name: 'Red',
      slug: 'red',
      matchedHex: '#FF0000',
      exact: true,
    });
    const nearest = getColorNameMatch('#FF0001');
    expect(nearest.name).toBe('Red');
    expect(nearest.exact).toBe(false);
    expect(getColor('#FF0001').hex).toBe('#FF0001');
    expect(getColorNameMatch('#000080').slug).toBe('navy-blue');
  });
  it('returns numeric values and round-trippable formatted strings in every format', () => {
    const color = getColor('#123456');
    expect(color.rgb).toEqual({ r: 18, g: 52, b: 86, alpha: 1 });
    for (const format of colorFormats)
      expect(parseColor(color.formats[format], format)).toBe('#123456');
    expect(Object.isFrozen(color)).toBe(true);
    expect(Object.isFrozen(color.rgb)).toBe(true);
    expect(getColorValue('#ff0000', 'hsl')).toEqual({
      h: 0,
      s: 100,
      l: 50,
      alpha: 1,
    });
    expect(getColorValue('#ff0000', 'oklch').l).toBeCloseTo(0.627955, 5);
  });
  it('reads current store values without emitting changes or changing the UI format', () => {
    const store = createColorStore('#123456', 'hsl');
    let calls = 0;
    store.subscribe(() => calls++);
    expect(store.getValue('hex')).toBe('#123456');
    expect(store.getColor().rgb.r).toBe(18);
    expect(store.getSnapshot().format).toBe('hsl');
    expect(calls).toBe(0);
    store.setHex('#f00');
    expect(store.getColor().name).toBe('Red');
  });
  it('keeps wheel hue at center and clamps saturation outside its radius', () => {
    const state = { h: 210, s: 70, v: 80 };
    expect(wheelAtPoint(state, 100, 100, 200, 200)).toEqual({
      h: 210,
      s: 0,
      v: 80,
    });
    expect(wheelAtPoint(state, 300, 100, 200, 200)).toEqual({
      h: 0,
      s: 100,
      v: 80,
    });
    expect(wheelAtPoint(state, 100, 200, 200, 200).h).toBe(90);
  });
});
describe('modular theme editing', () => {
  it('drops semantic roles from new and imported themes and CSS', () => {
    const theme = generateTheme('#ff0000');
    const legacy = fromLegacyTheme({
      ThemeID: theme.id,
      Name: theme.name,
      Structure: {
        ...theme.structure,
        userPreset: {
          ...theme.structure.userPreset,
          danger: theme.structure.userPreset.primary,
        },
      },
    });
    expect(Object.keys(legacy.structure.userPreset)).toEqual([
      'primary',
      'secondary',
      'accent',
    ]);
    expect(
      Object.keys(themeVariables(legacy)).some((key) =>
        /danger|success|warning|info|muted/.test(key),
      ),
    ).toBe(false);
    expect(theme.name).toBe('Red');
    expect(generateTheme('#f00', { name: 'My theme' }).name).toBe('My theme');
  });
  it('uses the three documented hue formulas', () => {
    expect(harmonyColors('#f00', 'triadic')).toEqual({
      primary: '#FF0000',
      secondary: '#00FF00',
      accent: '#0000FF',
    });
    const analogous = harmonyColors('#f00', 'analogous');
    expect(hexToHsv(analogous.secondary).h).toBeCloseTo(330, 0);
    expect(hexToHsv(analogous.accent).h).toBeCloseTo(30, 0);
    const split = harmonyColors('#f00', 'split-complementary');
    expect(hexToHsv(split.secondary).h).toBeCloseTo(150, 0);
    expect(hexToHsv(split.accent).h).toBeCloseTo(210, 0);
  });
  it('preserves manual colors, borders and backgrounds when editing another role', () => {
    const store = createThemeStore({
      theme: generateTheme('#f00', { background: 'tinted' }),
    });
    store.setColor('accent', '#123456');
    store.setBorder('radius', 'button', 2);
    store.setColor('primary', '#00ff00');
    expect(themeColor(store.getSnapshot().theme, 'accent')).toBe('#123456');
    const before = store.getSnapshot().theme;
    store.setColor('secondary', '#abcdef');
    expect(store.getSnapshot().theme.structure.websitePreset).toEqual(
      before.structure.websitePreset,
    );
    expect(
      store.getSnapshot().theme.structure.websitePreset.border.radius.button,
    ).toBe(2);
  });
  it('generates harmony only on request and preserves primary plus border values', () => {
    const store = createThemeStore({ theme: generateTheme('#f00') });
    store.setColor('accent', '#123456');
    store.setBorder('width', 'card', 4);
    store.setHarmony('triadic');
    expect(themeColor(store.getSnapshot().theme, 'accent')).toBe('#123456');
    store.generateHarmony();
    const theme = store.getSnapshot().theme;
    expect(themeColor(theme, 'primary')).toBe('#FF0000');
    expect(themeColor(theme, 'accent')).toBe('#0000FF');
    expect(theme.structure.websitePreset.border.width.card).toBe(4);
  });
  it('exports only requested colors and border targets', () => {
    expect(
      Object.keys(generateThemeTokens('#f00')).every((key) =>
        key.startsWith('--primary'),
      ),
    ).toBe(true);
    const store = createThemeStore();
    store.setBorder('radius', 'button', 1.25);
    expect(
      selectThemeTokens(store.getSnapshot().theme, {
        roles: [],
        radius: ['button'],
      }),
    ).toEqual({ '--border-radius-button': '1.25rem' });
    expect(
      selectThemeTokens(store.getSnapshot().theme, {
        roles: [],
        width: ['card'],
      }),
    ).toEqual({ '--border-width-card': '1px' });
  });
  it('validates editor input without partially modifying state', () => {
    const store = createThemeStore(),
      before = store.getSnapshot();
    expect(() => store.setBorder('radius', 'card', NaN)).toThrow();
    expect(() => store.setColor('accent', 'garbage')).toThrow();
    expect(store.getSnapshot()).toBe(before);
  });
});
