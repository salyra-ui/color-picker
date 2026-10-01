import { StrictMode, Fragment, useState } from 'react';
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
} from '@salyra-ui/color-picker/react';
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
} from '@salyra-ui/theme-studio/react';
import {
  createThemeStore,
  generateTheme,
  targets,
  type ThemeStore,
  type ThemeOptions,
} from '@salyra-ui/theme-studio';
import '../demo.css';
import ColorWorkflow from '../workflows/ColorReact';
import ThemeWorkflow from '../workflows/ThemeReact';
const indigo = generateTheme('#6366f1', { name: 'Indigo' }),
  coral = generateTheme('#ef6b52', { name: 'Coral' }),
  forest = generateTheme('#277d59', { name: 'Forest' });
function Preview() {
  const state = useTheme();
  return (
    <>
      <article className="preview-card">
        <span className="eyebrow">Live preview</span>
        <h3>Project settings</h3>
        <p>
          Change the colors, radius and border width to see how they appear on
          buttons and inputs.
        </p>
        <button className="primary-btn">Save changes</button>
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
      <ThemePalette shape="joined" />
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
            {targets.map((target) => (
              <Fragment key={target}>
                <ThemeRadius
                  target={target}
                  label={`${target === 'DEFAULT' ? 'Default' : target} radius`}
                />
                <ThemeBorderWidth
                  target={target}
                  label={`${target === 'DEFAULT' ? 'Default' : target} border width`}
                />
              </Fragment>
            ))}
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
        <strong>Salyra UI</strong>
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
          Choose a color in the standalone picker or edit the application theme.
          The examples below share color values, names and appearance settings
          through their providers.
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
        <section className="native-workflows"><h2>Color and theme workflows</h2><p>Use these examples to try history, forms, saved colors and draft editing.</p><div className="native-workflow-grid"><article className="native-workflow-card"><h3>Color form &amp; history</h3><p>Submit a color with alpha, undo edits, reset the form and save recent or favorite colors.</p><ColorWorkflow /></article><article className="native-workflow-card"><h3>Draft &amp; Apply</h3><p>Edit a separate draft, lock accent during generation and apply it to the preview. Export the selected tokens for Tailwind.</p><ThemeWorkflow /></article></div></section>
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
