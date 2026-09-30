import { describe, it, expect, vi } from 'vitest';
import {
  parseColor,
  formatColor,
  colorAtPoint,
  createColorStore,
  hexToHsv,
  hsvToHex,
  channelsToHex,
  normalizeHex,
  contrast,
  foreground,
} from '@sebytza23/color-picker';
import {
  createThemeStore,
  defaultTheme,
  generateTheme,
  generatePalette,
  parseTheme,
  fromLegacyTheme,
  toLegacyTheme,
  themeStyle,
  mountThemeStore,
} from '@sebytza23/theme-kit';
const red = generateTheme('#ef4444'),
  green = generateTheme('#22c55e');
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
describe('color math and picker', () => {
  it('supports RGB and HSL input without the old HSV/HSL mix-up', () => {
    expect(parseColor('255, 0, 128', 'rgb')).toBe('#FF0080');
    expect(parseColor('hsl(120 100% 25%)', 'hsl')).toBe('#008000');
    expect(formatColor('#FF0080', 'rgb')).toBe('255, 0, 128');
    expect(() => parseColor('256, 0, 0', 'rgb')).toThrow();
    expect(() => parseColor('0 101% 50%', 'hsl')).toThrow();
  });
  it('normalizes and validates without accepting CSS fragments', () => {
    expect(normalizeHex(' #abc ')).toBe('#AABBCC');
    for (const value of ['red', '#12', '#abcd', 'url(x)'])
      expect(() => normalizeHex(value)).toThrow();
  });
  it('round trips representative colors through HSV', () => {
    for (const hex of ['#000000', '#FFFFFF', '#22C55E', '#123456', '#FF0080'])
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
  });
  it('samples edges, clamps coordinates, and handles empty dimensions', () => {
    expect(hsvToHex(colorAtPoint(0, 220, 0, 220, 110))).toBe('#FF0000');
    expect(hsvToHex(colorAtPoint(0, 0, 0, 220, 110))).toBe('#FFFFFF');
    expect(hsvToHex(colorAtPoint(0, 999, 999, 220, 110))).toBe('#000000');
    expect(colorAtPoint(0, 1, 1, 0, 0)).toEqual({ h: 0, s: 0, v: 100 });
  });
  it('keeps hue and saturation when controlled hex echoes a black drag', () => {
    const s = createColorStore('#00ff00');
    s.setHSV({ v: 0, s: 80 });
    s.setHex(s.getSnapshot().hex);
    expect(s.getSnapshot()).toMatchObject({ h: 120, s: 80, v: 0 });
    s.setHSV({ v: 100 });
    expect(s.getSnapshot().hex).not.toBe('#FFFFFF');
  });
  it('has stable snapshots, notifies only changes, and unsubscribes', () => {
    const s = createColorStore(),
      fn = vi.fn();
    const initial = s.getSnapshot(),
      off = s.subscribe(fn);
    s.setHex(initial.hex);
    expect(s.getSnapshot()).toBe(initial);
    expect(fn).not.toHaveBeenCalled();
    s.setHSV({ h: 90 });
    expect(fn).toHaveBeenCalledTimes(1);
    off();
    s.setHSV({ h: 180 });
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('chooses a readable foreground for every generated shade', () => {
    for (const shade of Object.values(generatePalette('#123456'))) {
      const hex = channelsToHex(shade);
      expect(
        contrast(hex, channelsToHex(foreground(hex))),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
describe('theme data and CSS', () => {
  it('retains the seed at 500, generates ordered lightness, and uses both modes', () => {
    const palette = generatePalette('#6366F1');
    expect(channelsToHex(palette[500])).toBe('#6366F1');
    expect(themeStyle(red, 'light')).toContain('--foreground:0 0% 10%');
    expect(themeStyle(red, 'dark')).toContain('--foreground:0 0% 98%');
  });
  it('copies and freezes input and preserves the legacy wire shape', () => {
    const raw = JSON.parse(JSON.stringify(red)),
      t = parseTheme(raw);
    raw.structure.userPreset.primary.DEFAULT = 'bad';
    expect(t.structure.userPreset.primary.DEFAULT).not.toBe('bad');
    expect(Object.isFrozen(t.structure.websitePreset.border.width)).toBe(true);
    expect(fromLegacyTheme(toLegacyTheme(t)).structure).toEqual(t.structure);
    expect(
      fromLegacyTheme({
        ...toLegacyTheme(t),
        Structure: JSON.stringify(t.structure),
      }),
    ).toMatchObject({ id: t.id, name: t.name, structure: t.structure });
  });
  it('rejects malformed API data and CSS injection', () => {
    expect(() => parseTheme({})).toThrow();
    const raw = JSON.parse(JSON.stringify(red));
    raw.structure.userPreset.primary.DEFAULT =
      '0 0% 0%;}</style><script>alert(1)</script>';
    expect(() => parseTheme(raw)).toThrow();
  });
  it('generates primary/accent/secondary while preserving other user tokens', () => {
    const t = generateTheme('#0000ff', { base: red });
    expect(t.structure.websitePreset).toEqual(red.structure.websitePreset);
    expect(Object.keys(t.structure.userPreset)).toEqual([
      'primary',
      'secondary',
      'accent',
    ]);
    expect(t.structure.userPreset.primary).not.toEqual(
      red.structure.userPreset.primary,
    );
  });
});
describe('theme lifecycle', () => {
  it('exposes detached callbacks for composable event handlers', () => {
    const store = createThemeStore(),
      { generate } = store;
    generate('#123456');
    expect(store.getSnapshot().theme.id).toBe('custom-123456');
  });
  it('is standalone, instant and SSR safe without browser globals', async () => {
    const s = createThemeStore({ theme: red });
    expect(s.getSnapshot()).toMatchObject({
      theme: red,
      status: 'ready',
      pending: false,
    });
    const initial = s.getServerSnapshot();
    await s.start();
    expect(s.getSnapshot().theme).toEqual(red);
    expect(s.getServerSnapshot()).toBe(initial);
  });
  it('loads async with a separate loading state and fallback theme', async () => {
    const task = deferred<unknown>(),
      s = createThemeStore({
        fallbackTheme: green,
        loadTheme: () => task.promise,
      });
    expect(s.getSnapshot()).toMatchObject({ theme: green, status: 'loading' });
    const loading = s.start();
    task.resolve(red);
    await loading;
    expect(s.getSnapshot()).toMatchObject({
      theme: red,
      status: 'ready',
      pending: false,
      error: null,
    });
  });
  it.each([
    () => Promise.reject(new Error('offline')),
    () => {
      throw new Error('sync failure');
    },
    () => ({ broken: true }),
  ])(
    'switches to fallback and exits loading on loader failure',
    async (loadTheme) => {
      const s = createThemeStore({
        theme: red,
        fallbackTheme: green,
        loadTheme,
      });
      await s.start();
      expect(s.getSnapshot()).toMatchObject({
        theme: green,
        status: 'fallback',
        pending: false,
      });
      expect(s.getSnapshot().error).toBeInstanceOf(Error);
    },
  );
  it('ignores stale requests and cancels the signal on manual selection', async () => {
    const task = deferred<unknown>();
    let signal!: AbortSignal;
    const s = createThemeStore({
      loadTheme: (given) => {
        signal = given;
        return task.promise;
      },
    });
    const load = s.start();
    s.setTheme(green);
    task.resolve(red);
    await load;
    expect(signal.aborted).toBe(true);
    expect(s.getSnapshot().theme).toEqual(green);
  });
  it('newer reload wins even if older response arrives later', async () => {
    const a = deferred<unknown>(),
      b = deferred<unknown>();
    let calls = 0;
    const s = createThemeStore({
      loadTheme: () => (calls++ === 0 ? a.promise : b.promise),
    });
    const first = s.start(),
      second = s.reload();
    b.resolve(green);
    await second;
    a.resolve(red);
    await first;
    expect(s.getSnapshot().theme).toEqual(green);
  });
  it('times out a hung loader and ignores its eventual response', async () => {
    vi.useFakeTimers();
    const task = deferred<unknown>(),
      s = createThemeStore({
        fallbackTheme: green,
        loadTheme: () => task.promise,
        timeoutMs: 50,
      });
    const load = s.start();
    await vi.advanceTimersByTimeAsync(51);
    await load;
    expect(s.getSnapshot()).toMatchObject({
      theme: green,
      status: 'fallback',
      pending: false,
    });
    task.resolve(red);
    await Promise.resolve();
    expect(s.getSnapshot().theme).toEqual(green);
    vi.useRealTimers();
  });
  it('retries successfully after falling back', async () => {
    let fails = true;
    const s = createThemeStore({
      loadTheme: () => {
        if (fails) throw new Error('offline');
        return red;
      },
    });
    await s.start();
    fails = false;
    await s.reload();
    expect(s.getSnapshot()).toMatchObject({
      theme: red,
      status: 'ready',
      error: null,
    });
  });
  it('tolerates unavailable or malformed cache without discarding explicit SSR theme', async () => {
    const read = vi.fn(() => {
        throw new Error('blocked');
      }),
      s = createThemeStore({ theme: red, storage: { read, write() {} } });
    await s.start();
    expect(read).not.toHaveBeenCalled();
    expect(s.getSnapshot().theme).toEqual(red);
    const other = createThemeStore({ storage: { read, write() {} } });
    await other.start();
    expect(other.getSnapshot()).toMatchObject({
      theme: defaultTheme,
      status: 'ready',
    });
  });
  it('recovers from corrupted cache and loads from API', async () => {
    const s = createThemeStore({
      storage: { read: () => ({ bad: true }), write() {} },
      loadTheme: () => red,
    });
    await s.start();
    expect(s.getSnapshot().theme).toEqual(red);
  });
  it('keeps instances isolated across SSR requests and nested providers', () => {
    const a = createThemeStore({ theme: red }),
      b = createThemeStore({ theme: green });
    a.generate('#000');
    a.setMode('dark');
    expect(b.getSnapshot()).toMatchObject({ theme: green, mode: 'light' });
  });
  it('cleans listeners and debounces storage writes', async () => {
    vi.useFakeTimers();
    const write = vi.fn(),
      store = createThemeStore({ theme: red });
    const cleanup = mountThemeStore(store, { read: () => null, write });
    await Promise.resolve();
    store.generate('#111');
    store.generate('#222');
    expect(write).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(151);
    expect(write).toHaveBeenCalledTimes(1);
    cleanup();
    store.generate('#333');
    await vi.advanceTimersByTimeAsync(151);
    expect(write).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
