// @vitest-environment jsdom
import { StrictMode, act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  ThemeMode,
  ThemeName,
  useThemeMode,
  ThemeSelect,
  ThemeExport,
  ThemePicker,
  ThemeProvider,
  ThemeLoading,
  ThemeReady,
  ThemeHarmony,
  ThemeRadius,
  ThemeBorderWidth,
  ThemeGenerator,
  ThemePalette,
} from '@sebytza23/theme-kit-react';
import { generateTheme, createThemeStore } from '@sebytza23/theme-kit';
import {
  ColorAlphaInput,
  ColorMode,
  ColorWheel,
  ColorProvider,
  ColorArea,
  ColorInput,
  ColorSlider,
} from '@sebytza23/color-picker-react';
import { createColorStore } from '@sebytza23/color-picker';
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
const theme = generateTheme('#12abef');
describe('React SSR and hydration', () => {
  it('renders custom color format content and disables all picker controls on the server', () => {
    const store = createColorStore('#123456', 'rgb', 'area', true);
    const html = renderToString(
      <ColorProvider store={store}>
        <ColorInput />
        <ColorMode>{(format) => <span>Choose after {format}</span>}</ColorMode>
      </ColorProvider>,
    );
    expect(html).toContain('Choose after');
    expect(html).toContain('rgb');
    expect(html).toContain('inert=""');
    expect(html).toContain('disabled=""');
    store.setHex('#ff0000');
    expect(store.getSnapshot().disabled).toBe(true);
  });
  it('automatically exports only the color and geometry controls mounted in the context', async () => {
    const store = createThemeStore({ theme, modeStorage: false });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <ThemeProvider store={store}>
          <ThemeGenerator role="primary" />
          <ThemeRadius target="card" />
          <ThemeBorderWidth target="button" />
          <ThemeExport />
        </ThemeProvider>,
      );
    });
    const saved = JSON.parse(
      container.querySelector('.tk-export')!.textContent!,
    );
    expect(Object.keys(saved.theme.structure.userPreset)).toEqual(['primary']);
    expect(saved.theme.structure.websitePreset.border).toEqual({
      radius: { card: 0.5 },
      width: { button: 1 },
    });
    await act(() => root.unmount());
    container.remove();
    expect(store.getSnapshot().selection).toBeUndefined();
  });
  it('renders resolved variables on server and hydrates without mismatches', async () => {
    const ui = (
      <ThemeProvider theme={theme}>
        <ThemeLoading>Loading</ThemeLoading>
        <ThemeReady>
          <ThemeSelect themes={[theme]} />
          <ThemeExport format="css" />
          <ThemePicker view="shared-wheel" />
          <ThemePicker roles={['primary']} view="shared-wheel" />
          <ThemeGenerator />
          <ThemeGenerator role="accent" wheel />
          <ThemeHarmony />
          <ThemeRadius target="card" />
          <ThemePalette />
        </ThemeReady>
      </ThemeProvider>
    );
    const html = renderToString(ui);
    expect(html).toContain('--primary:');
    expect(html).not.toContain('Loading');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const error = vi.fn();
    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, ui, { onRecoverableError: error });
    });
    expect(error).not.toHaveBeenCalled();
    await act(() => root.unmount());
    container.remove();
  });
  it('hydrates transparent standalone controls with custom parts', async () => {
    const ui = (
      <ColorProvider value="#12345680" view="wheel">
        <ColorWheel classes={{ thumb: 'custom-dot' }} thumbText="X" />
        <ColorAlphaInput />
        <ColorInput />
        <ColorSlider channel="alpha" />
      </ColorProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    const error = vi.fn();
    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, ui, { onRecoverableError: error });
    });
    expect(error).not.toHaveBeenCalled();
    expect(
      (
        container.querySelector(
          'input[type="text"], input:not([type])',
        ) as HTMLInputElement
      ).value,
    ).toBe('#12345680');
    await act(() => root.unmount());
    container.remove();
  });
  it('applies a list selection to sibling pickers and emits the configured output', async () => {
    const other = generateTheme('#277d59'),
      store = createThemeStore({ theme }),
      change = vi.fn(),
      container = document.createElement('div'),
      root = createRoot(container);
    await act(() =>
      root.render(
        <ThemeProvider store={store}>
          <ThemeSelect themes={[theme, other]} />
          <ThemeGenerator />
          <ThemeExport onChange={change} />
        </ThemeProvider>,
      ),
    );
    const select = container.querySelector(
      '.tk-select select',
    ) as HTMLSelectElement;
    await act(() => {
      select.value = other.id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(store.getSnapshot().theme).toEqual(other);
    expect(
      (container.querySelector('.cp-input input') as HTMLInputElement).value,
    ).toBe('#277D59');
    expect(change.mock.calls.at(-1)?.[0].sourceTheme).toEqual(other);
    expect(
      Object.keys(change.mock.calls.at(-1)?.[0].theme.structure.userPreset),
    ).toEqual(['primary']);
    await act(() => store.setBorder('radius', 'card', 2));
    expect(select.value).toBe('');
    expect(change.mock.calls.at(-1)?.[0].sourceTheme.structure.websitePreset.border.radius.card).toBe(2);
    expect(JSON.parse(change.mock.calls.at(-1)?.[0].json).theme.structure).not.toHaveProperty('websitePreset');
    await act(() => root.unmount());
  });
  it('supports StrictMode and replaces loading with fallback on fetch failure', async () => {
    const container = document.createElement('div'),
      root = createRoot(container),
      store = createThemeStore({
        loadTheme: () => Promise.reject(new Error('offline')),
        fallbackTheme: theme,
      });
    await act(async () => {
      root.render(
        <StrictMode>
          <ThemeProvider store={store}>
            <ThemeLoading>Loading theme</ThemeLoading>
            <ThemeReady>Content</ThemeReady>
          </ThemeProvider>
        </StrictMode>,
      );
    });
    expect(container.textContent).toBe('Content');
    expect(
      container
        .querySelector('[data-theme-status]')
        ?.getAttribute('data-theme-status'),
    ).toBe('fallback');
    await act(() => root.unmount());
  });
  it('renders independent standalone color controls on server', () => {
    const html = renderToString(
      <ColorProvider value="#ff000080">
        <ColorArea />
        <ColorWheel classes={{ thumb: 'custom-dot' }} thumbText="X" />
        <ColorSlider channel="alpha" />
        <ColorAlphaInput />
        <ColorSlider />
        <ColorInput />
      </ColorProvider>,
    );
    expect(html).toContain('#FF000080');
    expect(html).toContain('custom-dot');
    expect(html).toContain('hsl(0 100% 50%)');
  });
  it('composes custom mode buttons with the hook and exports preference-only and name changes', async () => {
    const store = createThemeStore({ theme, mode: 'light' }),
      change = vi.fn(),
      container = document.createElement('div'),
      root = createRoot(container);
    function CustomMode() {
      const mode = useThemeMode();
      return (
        <button data-custom onClick={() => mode.setMode('system')}>
          🖥 {mode.preference}
        </button>
      );
    }
    await act(() =>
      root.render(
        <ThemeProvider store={store} modeStorage={false}>
          <CustomMode />
          <ThemeMode value="dark">🌙 Noapte</ThemeMode>
          <ThemeName />
          <ThemeExport onChange={change} />
        </ThemeProvider>,
      ),
    );
    await act(() =>
      (container.querySelector('[data-custom]') as HTMLButtonElement).click(),
    );
    expect(store.getSnapshot().modePreference).toBe('system');
    expect(JSON.parse(change.mock.calls.at(-1)?.[0].json).mode).toBe('system');
    await act(() =>
      (
        container.querySelector('button[aria-pressed]') as HTMLButtonElement
      ).click(),
    );
    expect(store.getSnapshot().modePreference).toBe('dark');
    expect(container.textContent).toContain('🌙 Noapte');
    await act(() => store.setName('My theme'));
    expect(
      (container.querySelector('.tk-name input') as HTMLInputElement).value,
    ).toBe('My theme');
    expect(change.mock.calls.at(-1)?.[0].theme.name).toBe('My theme');
    await act(() => root.unmount());
  });
});
