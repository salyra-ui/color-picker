import { describe, it, expect, vi } from 'vitest';
import {
  themeConfiguration,
  mergeThemeConfiguration,
  themeList,
  selectedThemeId,
  generateTheme,
  createThemeStore,
  createHttpThemeLoader,
  mountThemeStore,
  parseTheme,
} from '@salyra-ui/theme-studio';
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
  it('exports only primary and the active mode, without geometry or sibling palettes', () => {
    const store = createThemeStore({
      theme: red,
      mode: 'system',
      systemMode: 'dark',
      selection: { roles: ['primary'], background: true },
    });
    const config = themeConfiguration(store.getSnapshot()),
      saved = JSON.parse(config.json);
    expect(Object.keys(config.theme.structure.userPreset!)).toEqual([
      'primary',
    ]);
    expect(saved.theme.structure.websitePreset).not.toHaveProperty('border');
    expect(Object.keys(saved.theme.structure.websitePreset.background)).toEqual(
      ['dark'],
    );
    expect(Object.keys(saved.theme.structure.websitePreset.foreground)).toEqual(
      ['dark'],
    );
    expect(saved.mode).toBe('dark');
    expect(saved).not.toHaveProperty('systemMode');
    expect(config.sourceTheme).toBe(store.getSnapshot().theme);
    expect(
      mergeThemeConfiguration(green, config.json).structure.userPreset
        .secondary,
    ).toEqual(green.structure.userPreset.secondary);
  });
  it('keeps exactly two geometry fields in both JSON and CSS and restores them over a base', () => {
    const store = createThemeStore({
      theme: red,
      selection: { roles: [], radius: ['card'], width: ['button'] },
    });
    store.setBorder('radius', 'card', 1.5);
    store.setBorder('width', 'button', 3);
    const config = themeConfiguration(store.getSnapshot()),
      saved = JSON.parse(config.json);
    expect(saved.theme.structure).not.toHaveProperty('userPreset');
    expect(saved.theme.structure.websitePreset).toEqual({
      border: { radius: { card: 1.5 }, width: { button: 3 } },
    });
    expect(config.tokens).toEqual({
      '--border-width-button': '3px',
      '--border-radius-card': '1.5rem',
    });
    const restored = mergeThemeConfiguration(green, config.json);
    expect(restored.structure.websitePreset.border.radius.card).toBe(1.5);
    expect(restored.structure.websitePreset.border.width.button).toBe(3);
    expect(restored.structure.websitePreset.border.radius.input).toBe(
      green.structure.websitePreset.border.radius.input,
    );
    expect(restored.structure.userPreset).toEqual(green.structure.userPreset);
  });
  it('updates selections without editing the context and exports both modes only when requested', () => {
    const store = createThemeStore({
      theme: red,
      selection: { roles: ['primary'] },
    });
    const initial = store.getSnapshot().theme;
    store.setSelection({
      roles: ['accent'],
      background: true,
      modes: ['light', 'dark'],
    });
    const config = themeConfiguration(store.getSnapshot()),
      saved = JSON.parse(config.json);
    expect(store.getSnapshot().theme).toBe(initial);
    expect(Object.keys(saved.theme.structure.userPreset)).toEqual(['accent']);
    expect(Object.keys(saved.theme.structure.websitePreset.background)).toEqual(
      ['light', 'dark'],
    );
    expect(Object.isFrozen(config.theme.structure.userPreset)).toBe(true);
    expect(() =>
      themeConfiguration(store.getSnapshot(), { modes: [] }),
    ).toThrow();
    expect(() =>
      mergeThemeConfiguration(green, {
        theme: {
          ...config.theme,
          structure: { websitePreset: { border: { width: { card: -1 } } } },
        },
      }),
    ).toThrow();
  });
  it('tracks mounted editor fields and removes them on unmount without mutating the theme', () => {
    const store = createThemeStore({ theme: red });
    const primary = store.registerFields({ roles: ['primary'] });
    const card = store.registerFields({ roles: [], radius: ['card'] });
    const button = store.registerFields({ roles: [], width: ['button'] });
    expect(
      Object.keys(
        JSON.parse(themeConfiguration(store.getSnapshot()).json).theme.structure
          .userPreset,
      ),
    ).toEqual(['primary']);
    expect(themeConfiguration(store.getSnapshot()).tokens).toHaveProperty(
      '--border-radius-card',
    );
    card.destroy();
    expect(themeConfiguration(store.getSnapshot()).tokens).not.toHaveProperty(
      '--border-radius-card',
    );
    primary.update({ roles: ['accent'] });
    expect(
      Object.keys(
        JSON.parse(themeConfiguration(store.getSnapshot()).json).theme.structure
          .userPreset,
      ),
    ).toEqual(['accent']);
    button.destroy();
    primary.destroy();
    expect(store.getSnapshot().selection).toBeUndefined();
    expect(store.getSnapshot().theme).toEqual(red);
    const seeded = createThemeStore({
      theme: red,
      selection: { roles: ['primary'] },
    });
    seeded.registerFields({ roles: ['secondary'], radius: ['card'] });
    expect(
      Object.keys(
        JSON.parse(themeConfiguration(seeded.getSnapshot()).json).theme
          .structure.userPreset,
      ),
    ).toEqual(['primary']);
    expect(
      themeConfiguration(seeded.getSnapshot()).theme.structure,
    ).not.toHaveProperty('websitePreset');
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
