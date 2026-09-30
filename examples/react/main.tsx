import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ColorSurface,
  ColorViewSelect,
  ColorFormatSelect,
  ColorMode,
  ColorProvider,
  ColorAlphaInput,
  ColorPreview,
  ColorSlider,
  ColorInput,
  ColorSwatch,
} from '@sebytza23/color-picker-react';
import {
  ThemeSelect,
  ThemeExport,
  ThemePicker,
  ThemeColor,
  ThemeHarmony,
  ThemeRadius,
  ThemeBorderWidth,
  ThemeBackground,
  ThemeProvider,
  ThemeGenerator,
  ThemePalette,
  ThemeLoading,
  ThemeReady,
  ThemeError,
  ThemeSwatch,
  ThemeMode,
  ThemeName,
  useTheme,
} from '@sebytza23/theme-kit-react';
import {
  createThemeStore,
  generateTheme,
  type ThemeStore,
  type ThemeOptions,
} from '@sebytza23/theme-kit';
import '../demo.css';
const indigo = generateTheme('#6366f1', { name: 'Indigo' }),
  coral = generateTheme('#ef6b52', { name: 'Coral' }),
  forest = generateTheme('#277d59', { name: 'Forest' });
function Preview() {
  const state = useTheme();
  return (
    <>
      <article className="preview-card">
        <span className="eyebrow">Live preview</span>
        <h3>A theme that feels like you.</h3>
        <p>
          Generate a harmony or choose each color independently. Every component
          inherits the same theme.
        </p>
        <button className="primary-btn">Create something</button>
        <input
          className="preview-input"
          aria-label="Preview input"
          placeholder="Your input shape"
        />
        <div className="role-samples">
          <span className="secondary-sample">Secondary</span>
          <span className="accent-sample">Accent</span>
        </div>
      </article>
      <ThemePalette />
      <div className="status">
        {state.theme.name} · {state.status}
      </div>
    </>
  );
}
function ThemeDemo({ store }: { store: ThemeStore }) {
  return (
    <ThemeProvider store={store}>
      <div className="panel-header">
        <h2>02 / Theme generator</h2>
        <ThemeMode className="mode-btn" />
      </div>
      <div className="panel-body">
        <ThemeName />
        <ThemeSelect themes={[indigo, coral, forest]} />
        <ThemePicker />
        <ThemeHarmony />

        <details className="editor-details">
          <summary>Borders &amp; shape</summary>
          <div className="border-editors">
            <ThemeRadius target="card" label="Card radius" />
            <ThemeBorderWidth target="card" label="Card border width" />
            <ThemeRadius target="button" label="Button radius" />
            <ThemeBorderWidth target="button" label="Button border width" />
            <ThemeRadius target="input" label="Input radius" />
            <ThemeBorderWidth target="input" label="Input border width" />
          </div>
        </details>
        <ThemeBackground />
        <div className="suggestions">
          <ThemeSwatch theme={indigo} />
          <ThemeSwatch theme={coral} />
          <ThemeSwatch theme={forest} />
        </div>
        <Preview />
        <details className="editor-details">
          <summary>Export configuration</summary>
          <ThemeExport />
        </details>
      </div>
    </ThemeProvider>
  );
}
function AsyncDemo({ source }: { source: ThemeStore }) {
  const [version, setVersion] = useState(0),
    [fail, setFail] = useState(true);
  const selected = source.getSnapshot();
  const options: ThemeOptions = {
    mode: selected.mode,
    modeStorage: false,
    fallbackTheme: selected.theme,
    loadTheme: async (signal) => {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 900);
        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(new Error('Cancelled'));
          },
          { once: true },
        );
      });
      if (fail) throw new Error('Demo network unavailable');
      return selected.theme;
    },
  };
  return (
    <>
      <div className="section-note">03 / Async loading + fallback theme</div>
      <div className="panel">
        <ThemeProvider key={version} {...options}>
          <ThemeLoading>
            <div role="status" className="loading">
              Your custom loading component goes here…
            </div>
          </ThemeLoading>
          <ThemeError>
            {(_, retry) => (
              <div className="error">
                Fetch failed. Selected theme fallback is active.
                <button onClick={() => void retry()}>Retry</button>
              </div>
            )}
          </ThemeError>
          <ThemeReady>
            <div className="panel-body">
              <Preview />
            </div>
          </ThemeReady>
        </ThemeProvider>
      </div>
      <div className="suggestions" style={{ marginTop: 12 }}>
        <button
          onClick={() => {
            setFail(false);
            setVersion((v) => v + 1);
          }}
        >
          Simulate success
        </button>
        <button
          onClick={() => {
            setFail(true);
            setVersion((v) => v + 1);
          }}
        >
          Simulate failure
        </button>
      </div>
    </>
  );
}
function App() {
  const [editorStore] = useState(() => createThemeStore({ theme: indigo }));
  return (
    <>
      <nav>
        <strong>theme / kit</strong>
        <a href="/">React</a>
        <a href="/svelte.html">Svelte</a>
        <a href="/vue.html">Vue</a>
      </nav>
      <main>
        <div className="eyebrow">Two packages. Your components.</div>
        <h1>
          Make it
          <br />
          your color.
        </h1>
        <p className="intro">
          A standalone color picker and a theme engine that work together.
          Compose the controls, bring your own UI, and keep the first render
          ready.
        </p>
        <div className="demo-grid">
          <section className="panel">
            <div className="panel-header">
              <h2>01 / Color picker</h2>
              <span className="tag">STANDALONE</span>
            </div>
            <ColorProvider value="#ef6b52">
              <div className="panel-body">
                <ColorViewSelect />
                <ColorSurface />
                <ColorSlider channel="alpha" />
                <ColorAlphaInput />
                <ColorPreview />
                <ColorFormatSelect />
                <ColorInput />
                <ColorMode />
                <div className="swatches">
                  {['#6366F1', '#EF6B52', '#277D59', '#F59E0B', '#0EA5E9'].map(
                    (value) => (
                      <ColorSwatch key={value} value={value} />
                    ),
                  )}
                </div>
                <p className="description">
                  Mouse, touch, pen or keyboard. This picker has no dependency
                  on the theme engine.
                </p>
              </div>
            </ColorProvider>
          </section>
          <section className="panel">
            <ThemeDemo store={editorStore} />
          </section>
        </div>
        <AsyncDemo source={editorStore} />
        <footer>
          Framework independent core · Scoped providers · SSR ready · Copy and
          customize
        </footer>
      </main>
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
