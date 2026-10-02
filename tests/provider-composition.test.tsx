// @vitest-environment jsdom
import '@salyra-ui/theme-studio/vanilla';
import { act, createRef } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  ThemeProvider,
  ThemeStudio,
  ThemeReady,
  ThemeLoading,
  ThemeError,
  useTheme,
  createThemeStore,
  generateTheme,
} from '@salyra-ui/theme-studio/react';
import {
  type ThemeRootElement,
  type ThemeProviderElement,
} from '@salyra-ui/theme-studio/vanilla';
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function State({ id }: { id: string }) {
  const state = useTheme();
  return (
    <output data-context={id}>
      {state.theme.name}:{state.modePreference}
    </output>
  );
}

describe('providers composed over Root and Scope', () => {
  it('hydrates the ready recipe with scope attributes, its actual ref and nested isolated roots', async () => {
    const outer = createThemeStore({
      theme: generateTheme('#5268E0', { name: 'Outer' }),
      mode: 'light',
      modeStorage: false,
    });
    const inner = createThemeStore({
      theme: generateTheme('#277D59', { name: 'Inner' }),
      mode: 'dark',
      modeStorage: false,
    });
    const ref = createRef<HTMLDivElement>();
    const ui = (
      <ThemeProvider
        store={outer}
        modeStorage={false}
        ref={ref}
        className="user-scope"
        style={{ padding: 17 }}
        scopeProps={{
          id: 'app-scope',
          'aria-label': 'Themed app',
          style: { margin: 4 },
        }}
      >
        <State id="outer" />
        <ThemeStudio.Root store={inner} options={{ modeStorage: false }}>
          <ThemeStudio.Scope data-inner>
            <State id="inner" />
          </ThemeStudio.Scope>
        </ThemeStudio.Root>
      </ThemeProvider>
    );
    const host = document.createElement('div');
    host.innerHTML = renderToString(ui);
    document.body.append(host);
    const errors = vi.fn();
    let root!: ReturnType<typeof hydrateRoot>;
    await act(() => {
      root = hydrateRoot(host, ui, { onRecoverableError: errors });
    });
    expect(errors).not.toHaveBeenCalled();
    expect(ref.current).toBe(host.querySelector('#app-scope'));
    expect(ref.current!.classList.contains('user-scope')).toBe(true);
    expect(ref.current!.style.padding).toBe('17px');
    expect(ref.current!.style.margin).toBe('4px');
    expect(ref.current!.getAttribute('aria-label')).toBe('Themed app');
    await act(() => outer.setMode('dark'));
    expect(host.querySelector('[data-context="outer"]')!.textContent).toBe(
      'Outer:dark',
    );
    expect(host.querySelector('[data-context="inner"]')!.textContent).toBe(
      'Inner:dark',
    );
    await act(() => outer.setDisabled(true));
    expect(host.querySelector('fieldset')!.disabled).toBe(true);
    expect(
      host.querySelector('[data-inner]')!.getAttribute('data-disabled'),
    ).toBe('false');
    await act(() => root.unmount());
    host.remove();
  });

  it('mounts persistence and loading once and preserves a custom fallback/error boundary', async () => {
    let fail!: (reason: Error) => void;
    const fallback = generateTheme('#277D59', { name: 'Offline theme' });
    const loadTheme = vi.fn(
      () =>
        new Promise<never>((_, reject) => {
          fail = reject;
        }),
    );
    const read = vi.fn(() => null),
      write = vi.fn();
    const options = {
      fallbackTheme: fallback,
      loadTheme,
      storage: { read, write },
      modeStorage: false as const,
    };
    const host = document.createElement('div'),
      root = createRoot(host);
    await act(() =>
      root.render(
        <ThemeProvider {...options}>
          <ThemeLoading>
            <p>Our loading content</p>
          </ThemeLoading>
          <ThemeReady>
            <State id="loaded" />
          </ThemeReady>
          <ThemeError>{() => 'Our error content'}</ThemeError>
        </ThemeProvider>,
      ),
    );
    expect(host.textContent).toContain('Our loading content');
    expect(loadTheme).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledTimes(1);
    await act(() => fail(new Error('offline')));
    expect(host.textContent).toContain('Offline theme:system');
    expect(host.textContent).toContain('Our error content');
    expect(
      host
        .querySelector('[data-tk-part="scope"]')!
        .getAttribute('data-theme-status'),
    ).toBe('fallback');
    await act(() => root.unmount());
  });

  it('keeps native Root headless, applies multiple Scopes and reconnects after store replacement', () => {
    const root = document.createElement('tk-root') as ThemeRootElement;
    const initial = createThemeStore({
      theme: generateTheme('#5268E0'),
      mode: 'dark',
      modeStorage: false,
    });
    const stop = vi.spyOn(initial, 'stop');
    root.setStore(initial, { modeStorage: false });
    root.innerHTML =
      '<section><tk-scope class="my-scope" style="padding:13px"><button data-tk-mode="light">Day</button></tk-scope></section><tk-scope class="second-scope"></tk-scope>';
    document.body.append(root);
    expect(root.style.getPropertyValue('--primary')).toBe('');
    expect(root.querySelectorAll('fieldset')).toHaveLength(0);
    expect(root.querySelectorAll('[inert]')).toHaveLength(0);
    const scopes = root.querySelectorAll<HTMLElement>('tk-scope');
    expect(scopes[0].style.padding).toBe('13px');
    initial.setMode('light');
    for (const scope of scopes) expect(scope.dataset.mode).toBe('light');
    const next = createThemeStore({
      theme: generateTheme('#f00'),
      mode: 'dark',
      modeStorage: false,
    });
    root.setStore(next, { modeStorage: false });
    expect(stop).toHaveBeenCalledTimes(1);
    for (const scope of scopes)
      expect(scope.style.getPropertyValue('--primary')).toBe('0 100% 50%');
    initial.setMode('system');
    expect(scopes[0].dataset.mode).toBe('dark');
    root.querySelector<HTMLButtonElement>('button')!.click();
    expect(next.getSnapshot().modePreference).toBe('light');
    root.remove();
    next.setMode('dark');
    expect(scopes[0].dataset.mode).toBe('light');
  });

  it('isolates nested native contexts and removes the ready disabled boundary when enabled', () => {
    const outer = document.createElement('tk-provider') as ThemeProviderElement;
    const inner = document.createElement('tk-root') as ThemeRootElement;
    const store = createThemeStore({ disabled: true, modeStorage: false });
    const nested = createThemeStore({
      theme: generateTheme('#f00'),
      modeStorage: false,
    });
    outer.setStore(store, { modeStorage: false });
    // Match the disabled markup emitted by SSR.
    outer.setAttribute('inert', '');
    outer.innerHTML =
      '<button data-tk-mode="dark">Night</button><button disabled>Local disabled</button>';
    inner.setStore(nested, { modeStorage: false });
    inner.innerHTML =
      '<tk-scope><button data-tk-mode="light">Day</button></tk-scope>';
    outer.append(inner);
    document.body.append(outer);
    store.setDisabled(false);
    expect(outer.hasAttribute('inert')).toBe(false);
    expect(outer.querySelector<HTMLButtonElement>('button')!.disabled).toBe(
      false,
    );
    expect(outer.querySelectorAll('button')[1].disabled).toBe(true);
    const before = store.getSnapshot().modePreference;
    inner.querySelector<HTMLButtonElement>('button')!.click();
    expect(store.getSnapshot().modePreference).toBe(before);
    expect(nested.getSnapshot().modePreference).toBe('light');
    outer.remove();
  });
  it('shares one native load across multiple scopes and shows a fallback after failure', async () => {
    let fail!: (reason: Error) => void;
    const fallback = generateTheme('#277D59');
    const loadTheme = vi.fn(
      () =>
        new Promise<never>((_, reject) => {
          fail = reject;
        }),
    );
    const read = vi.fn(() => null),
      write = vi.fn();
    const root = document.createElement('tk-root') as ThemeRootElement;
    root.options = {
      fallbackTheme: fallback,
      loadTheme,
      storage: { read, write },
      modeStorage: false,
    };
    root.innerHTML =
      '<tk-scope><tk-loading>Custom loading</tk-loading><tk-ready>Content</tk-ready></tk-scope><tk-scope></tk-scope>';
    document.body.append(root);
    await Promise.resolve();
    const scopes = root.querySelectorAll<HTMLElement>('tk-scope');
    expect(read).toHaveBeenCalledTimes(1);
    expect(loadTheme).toHaveBeenCalledTimes(1);
    for (const scope of scopes) {
      expect(scope.dataset.themeStatus).toBe('loading');
      expect(scope.style.getPropertyValue('--tk-ready-display')).toBe('none');
    }
    fail(new Error('offline'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const scope of scopes) {
      expect(scope.dataset.themeStatus).toBe('fallback');
      expect(scope.dataset.theme).toBe(fallback.id);
      expect(scope.style.getPropertyValue('--tk-ready-display')).toBe(
        'contents',
      );
      expect(scope.style.getPropertyValue('--tk-error-display')).toBe(
        'contents',
      );
    }
    root.remove();
  });
});
