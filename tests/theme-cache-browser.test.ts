// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import {
  watchThemeUpdates,
  browserStorage,
  createThemeStore,
  generateTheme,
} from '@salyra-ui/theme-studio';
describe('mounted cache invalidation', () => {
  it('revalidates on focus and coalesces notifications during a request', async () => {
    let resolve!: () => void, notify!: () => void;
    const store = createThemeStore(),
      reload = vi
        .spyOn(store, 'reload')
        .mockImplementationOnce(() => new Promise<void>((r) => (resolve = r)))
        .mockResolvedValue(undefined),
      unsubscribe = vi.fn();
    const stop = watchThemeUpdates(store, {
      subscribe: (fn) => {
        notify = fn;
        return unsubscribe;
      },
    });
    window.dispatchEvent(new Event('focus'));
    notify();
    notify();
    expect(reload).toHaveBeenCalledTimes(1);
    resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(reload).toHaveBeenCalledTimes(2);
    stop();
    notify();
    window.dispatchEvent(new Event('focus'));
    expect(reload).toHaveBeenCalledTimes(2);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
  it('polls only while mounted and validates intervals', async () => {
    vi.useFakeTimers();
    const store = createThemeStore(),
      reload = vi.spyOn(store, 'reload').mockResolvedValue(undefined);
    const stop = watchThemeUpdates(store, { onFocus: false, intervalMs: 1000 });
    await vi.advanceTimersByTimeAsync(2000);
    expect(reload).toHaveBeenCalledTimes(2);
    stop();
    await vi.advanceTimersByTimeAsync(2000);
    expect(reload).toHaveBeenCalledTimes(2);
    expect(() => watchThemeUpdates(store, { intervalMs: 0 })).toThrow();
    vi.useRealTimers();
  });
  it('filters storage events by key and validates the envelope', () => {
    const storage = browserStorage('test-theme'),
      listener = vi.fn(),
      stop = storage.subscribe!(listener),
      theme = generateTheme('#123456');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'other',
        storageArea: localStorage,
        newValue: JSON.stringify({ version: 1, theme }),
      }),
    );
    expect(listener).not.toHaveBeenCalled();
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'test-theme',
        storageArea: localStorage,
        newValue: JSON.stringify({ version: 1, theme }),
      }),
    );
    expect(listener).toHaveBeenCalledWith(theme);
    stop();
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'test-theme',
        storageArea: localStorage,
        newValue: 'broken',
      }),
    );
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
