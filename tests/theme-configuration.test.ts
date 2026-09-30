import { describe, it, expect, vi } from 'vitest';
import {
  themeConfiguration,
  themeList,
  selectedThemeId,
  generateTheme,
  createThemeStore,
  createHttpThemeLoader,
  mountThemeStore,
  parseTheme,
} from '@sebytza23/theme-kit';
const red = generateTheme('#f00', { name: 'Red' }),
  green = generateTheme('#0f0', { name: 'Green' });
describe('current configuration and lists', () => {
  it('returns exact edited palettes, borders, background and mode in JSON and CSS', () => {
    const store = createThemeStore({ theme: red, mode: 'dark' });
    store.setColor('accent', '#123456');
    store.setBorder('radius', 'card', 1.25);
    store.setBackground('tinted');
    const value = themeConfiguration(store.getSnapshot()),
      saved = JSON.parse(value.json);
    expect(saved.mode).toBe('dark');
    expect(parseTheme(saved.theme)).toEqual(store.getSnapshot().theme);
    expect(value.theme).toBe(store.getSnapshot().theme);
    expect(value.css).toContain('--border-radius-card:1.25rem');
    expect(value.tokens['--background']).toBe(
      store.getSnapshot().theme.structure.websitePreset.background.dark,
    );
    expect(Object.isFrozen(value.tokens)).toBe(true);
    expect(themeConfiguration(store.getSnapshot())).toBe(value);
    expect(
      Object.keys(
        themeConfiguration(store.getSnapshot(), { roles: ['accent'] }).tokens,
      ).every((k) => k.startsWith('--accent')),
    ).toBe(true);
  });
  it('validates unique lists and identifies edited copies as custom themes', () => {
    expect(themeList([red, green])).toEqual([red, green]);
    expect(() => themeList([red, red])).toThrow();
    const store = createThemeStore({ theme: red });
    expect(
      selectedThemeId(store.getSnapshot().theme, themeList([red, green])),
    ).toBe(red.id);
    store.setBorder('width', 'card', 4);
    expect(
      selectedThemeId(store.getSnapshot().theme, themeList([red, green])),
    ).toBeUndefined();
  });
});
describe('conditional remote cache', () => {
  it('reuses a validated 304 and replaces the cached revision on 200', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(red), { headers: { ETag: '"1"' } }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 304 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(green), { headers: { ETag: '"2"' } }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 304 }));
    const loader = createHttpThemeLoader('/theme', { fetch: request }),
      signal = new AbortController().signal;
    expect(await loader(signal)).toEqual(red);
    expect(await loader(signal)).toEqual(red);
    expect(request.mock.calls[1][1].headers.get('If-None-Match')).toBe('"1"');
    expect(await loader(signal)).toEqual(green);
    expect(await loader(signal)).toEqual(green);
    expect(request.mock.calls[3][1].headers.get('If-None-Match')).toBe('"2"');
  });
  it('supports manual invalidation and ordinary endpoints without ETags', async () => {
    const request = vi.fn<typeof fetch>(() =>
        Promise.resolve(
          new Response(JSON.stringify(red), { headers: { ETag: '"1"' } }),
        ),
      ),
      loader = createHttpThemeLoader('/theme', { fetch: request });
    await loader(new AbortController().signal);
    loader.invalidate();
    await loader(new AbortController().signal);
    expect(
      new Headers(request.mock.calls[1][1]?.headers).has('If-None-Match'),
    ).toBe(false);
  });
  it('does not replace a valid cached response with invalid data or an aborted request', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(red), { headers: { ETag: '"1"' } }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ bad: true })))
      .mockResolvedValueOnce(new Response(null, { status: 304 }));
    const loader = createHttpThemeLoader('/theme', { fetch: request });
    await loader(new AbortController().signal);
    await expect(loader(new AbortController().signal)).rejects.toThrow();
    expect(await loader(new AbortController().signal)).toEqual(red);
    const controller = new AbortController();
    controller.abort();
    await expect(loader(controller.signal)).rejects.toThrow();
  });
  it('revalidates after cached first paint and persists the new remote theme', async () => {
    vi.useFakeTimers();
    const write = vi.fn(),
      store = createThemeStore({
        storage: { read: () => red, write },
        loadTheme: () => green,
      });
    const stop = mountThemeStore(store, { read: () => red, write });
    await Promise.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(151);
    expect(store.getSnapshot().theme).toEqual(green);
    expect(write).toHaveBeenLastCalledWith(green);
    stop();
    vi.useRealTimers();
  });
  it('applies external storage updates without echoing writes and unsubscribes', async () => {
    vi.useFakeTimers();
    let notify: (value: unknown) => void = () => {};
    const write = vi.fn(),
      unsubscribe = vi.fn(),
      store = createThemeStore({ theme: red });
    const stop = mountThemeStore(store, {
      read: () => null,
      write,
      subscribe: (listener) => {
        notify = listener;
        return unsubscribe;
      },
    });
    await Promise.resolve();
    store.setBorder('width', 'card', 2);
    notify(green);
    await vi.advanceTimersByTimeAsync(200);
    expect(store.getSnapshot().theme).toEqual(green);
    expect(write).not.toHaveBeenCalled();
    notify({ bad: true });
    expect(store.getSnapshot().theme).toEqual(green);
    stop();
    expect(unsubscribe).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
