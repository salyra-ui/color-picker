// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { browserModeStorage, createThemeStore, generateTheme, mountThemeMode, themeConfiguration, themeModeActions, suggestedThemeName, parseTheme } from '@salyra-ui/theme-studio';
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); localStorage.clear(); });
function media(dark: boolean) {
  let listener: (() => void) | undefined;
  const query = { matches: dark, addEventListener: vi.fn((_: string, fn: () => void) => { listener = fn; }), removeEventListener: vi.fn(() => { listener = undefined; }) };
  vi.stubGlobal('matchMedia', () => query);
  window.matchMedia = (() => query) as unknown as typeof window.matchMedia;
  return { query, change(value: boolean) { query.matches = value; listener?.(); } };
}
describe('persisted system/light/dark preference', () => {
  it('keeps SSR deterministic, resolves system on mount and follows OS only in system mode', () => {
    const os = media(true), store = createThemeStore({ mode: 'system', systemMode: 'light' });
    expect(store.getServerSnapshot().mode).toBe('light');
    const stop = mountThemeMode(store, false);
    expect(store.getSnapshot().mode).toBe('dark');
    expect(store.getSnapshot().modePreference).toBe('system');
    store.setMode('light'); os.change(false); os.change(true);
    expect(store.getSnapshot().mode).toBe('light');
    store.setMode('system');
    expect(store.getSnapshot().mode).toBe('dark');
    os.change(false);
    expect(store.getSnapshot().mode).toBe('light');
    expect(store.getServerSnapshot().mode).toBe('light');
    stop(); os.change(true);
    expect(store.getSnapshot().mode).toBe('light');
    expect(os.query.removeEventListener).toHaveBeenCalledTimes(1);
  });
  it('persists the preference across new stores, never replaces system with its resolved mode', () => {
    const os = media(true), storage = browserModeStorage('mode-test'), first = createThemeStore();
    const stop = mountThemeMode(first, storage);
    first.setMode('dark'); expect(localStorage.getItem('mode-test')).toBe('dark');
    first.setMode('system'); os.change(false);
    expect(localStorage.getItem('mode-test')).toBe('system');
    stop();
    const second = createThemeStore({ mode: 'dark' }), stopSecond = mountThemeMode(second, storage);
    expect(second.getSnapshot().modePreference).toBe('system');
    expect(second.getSnapshot().mode).toBe('light');
    stopSecond();
  });
  it('synchronizes other tabs without echoing writes, ignoring invalid values', () => {
    media(false);
    const storage = browserModeStorage('shared-mode'), write = vi.spyOn(storage, 'write'), store = createThemeStore();
    const stop = mountThemeMode(store, storage);
    for (const value of ['invalid', 'dark']) window.dispatchEvent(new StorageEvent('storage', { key: 'shared-mode', storageArea: localStorage, newValue: value }));
    expect(store.getSnapshot().modePreference).toBe('dark'); expect(write).not.toHaveBeenCalled();
    stop(); window.dispatchEvent(new StorageEvent('storage', { key: 'shared-mode', storageArea: localStorage, newValue: 'light' }));
    expect(store.getSnapshot().modePreference).toBe('dark');
  });
  it('tolerates unavailable persistence and cycles all three preferences', () => {
    media(false); const store = createThemeStore(), actions = themeModeActions(store);
    const stop = mountThemeMode(store, { read: () => { throw new Error('private'); }, write: () => { throw new Error('quota'); } });
    actions.cycle(); expect(store.getSnapshot().modePreference).toBe('light');
    actions.cycle(); expect(store.getSnapshot().modePreference).toBe('dark');
    actions.cycle(); expect(store.getSnapshot().modePreference).toBe('system');
    const exported = themeConfiguration(store.getSnapshot());
    expect(JSON.parse(exported.json).mode).toBe('system');
    expect(exported.mode).toBe('light');
    expect(() => store.setMode('bad' as 'system')).toThrow(); stop();
  });
});
describe('suggested and custom theme names', () => {
  it('proposes names and preserves explicit names through all generator edits and JSON round trips', () => {
    const store = createThemeStore({ theme: generateTheme('#123456') });
    expect(store.getSnapshot().theme.name).toBe(suggestedThemeName(store.getSnapshot().theme));
    store.setName('Noaptea mea 🌙'); store.setColor('primary', '#f00');
    store.generateHarmony(); store.generate('#00f'); store.setBorder('radius', 'card', 2); store.setBackground('tinted');
    expect(store.getSnapshot().theme.name).toBe('Noaptea mea 🌙');
    const saved = parseTheme(JSON.parse(themeConfiguration(store.getSnapshot()).json).theme), restored = createThemeStore({ theme: saved });
    restored.setColor('primary', '#ff0'); expect(restored.getSnapshot().theme.name).toBe('Noaptea mea 🌙');
    restored.setName(); expect(restored.getSnapshot().theme.nameSource).toBe('suggested');
    expect(restored.getSnapshot().theme.name).toBe(suggestedThemeName(restored.getSnapshot().theme));
    expect(() => restored.setName('x'.repeat(201))).toThrow();
  });
});
