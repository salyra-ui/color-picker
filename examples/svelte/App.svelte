<script lang="ts">
  import {
    ColorAlphaInput,
    ColorPreview,
    ColorSurface,
    ColorViewSelect,
    ColorFormatSelect,
    ColorMode,
    ColorProvider,
    ColorArea,
    ColorSlider,
    ColorInput,
    ColorSwatch,
  } from '@sebytza23/color-picker-svelte';
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
  } from '@sebytza23/theme-kit-svelte';
  import { createThemeStore, generateTheme } from '@sebytza23/theme-kit';
  const indigo = generateTheme('#6366f1', { name: 'Indigo' }),
    coral = generateTheme('#ef6b52', { name: 'Coral' }),
    forest = generateTheme('#277d59', { name: 'Forest' });
  let fail = $state(true),
    version = $state(0);
  const editorStore = createThemeStore({ theme: indigo });
  function options() {
    const shouldFail = fail,
      selected = editorStore.getSnapshot();
    return {
      fallbackTheme: selected.theme,
      mode: selected.mode,
    modeStorage: false as const,
      loadTheme: async () => {
        await new Promise((r) => setTimeout(r, 900));
        if (shouldFail) throw new Error('Demo offline');
        return selected.theme;
      },
    };
  }
</script>

<nav>
  <strong>theme / kit</strong><a href="/">React</a><a href="/svelte.html"
    >Svelte</a
  ><a href="/vue.html">Vue</a>
</nav>
<main>
  <div class="eyebrow">Svelte 5 / composable components</div>
  <h1>Make it<br />your color.</h1>
  <p class="intro">
    A color picker on its own, a theme generator in context. Same engine, native
    Svelte components.
  </p>
  <div class="demo-grid">
    <section class="panel">
      <div class="panel-header">
        <h2>01 / Color picker</h2>
        <span class="tag">STANDALONE</span>
      </div>
      <ColorProvider value="#ef6b52"
        ><div class="panel-body">
          <ColorViewSelect /><ColorSurface />
          <ColorSlider channel="alpha" /><ColorAlphaInput /><ColorPreview
          /><ColorFormatSelect /><ColorInput /><ColorMode />
          <div class="swatches">
            {#each ['#6366F1', '#EF6B52', '#277D59', '#F59E0B'] as value}<ColorSwatch
                {value}
              />{/each}
          </div>
        </div></ColorProvider
      >
    </section>
    <section class="panel">
      <ThemeProvider store={editorStore}
        ><div class="panel-header">
          <h2>02 / Theme generator</h2>
          <ThemeMode class="mode-btn" />
        </div>
        <div class="panel-body">
          <ThemeName />
        <ThemeSelect themes={[indigo, coral, forest]} /><ThemePicker
          /><ThemeHarmony />

          <details class="editor-details">
            <summary>Borders &amp; shape</summary>
            <div class="border-editors">
              <ThemeRadius target="card" label="Card radius" /><ThemeBorderWidth
                target="card"
                label="Card border width"
              />
              <ThemeRadius
                target="button"
                label="Button radius"
              /><ThemeBorderWidth target="button" label="Button border width" />
              <ThemeRadius
                target="input"
                label="Input radius"
              /><ThemeBorderWidth target="input" label="Input border width" />
            </div>
          </details>
          <ThemeBackground />
          <div class="suggestions">
            <ThemeSwatch theme={indigo} /><ThemeSwatch
              theme={coral}
            /><ThemeSwatch theme={forest} />
          </div>
          <article class="preview-card">
            <h3>A theme that feels like you.</h3>
            <p>Generated palettes, scoped variables, your layout.</p>
            <button class="primary-btn">Create something</button><input
              class="preview-input"
              aria-label="Preview input"
              placeholder="Your input shape"
            />
            <div class="role-samples">
              <span class="secondary-sample">Secondary</span><span
                class="accent-sample">Accent</span
              >
            </div>
          </article>
          <ThemePalette />
          <details class="editor-details">
            <summary>Export configuration</summary><ThemeExport />
          </details>
        </div></ThemeProvider
      >
    </section>
  </div>
  <div class="section-note">03 / Async loading + fallback theme</div>
  <div class="panel">
    {#key version}<ThemeProvider options={options()}
        ><ThemeLoading
          ><div role="status" class="loading">
            Your custom loading component goes here…
          </div></ThemeLoading
        ><ThemeError
          >{#snippet children(error, retry)}<div class="error">
              {error.message}. Selected theme fallback is active.<button
                onclick={() => retry()}>Retry</button
              >
            </div>{/snippet}</ThemeError
        ><ThemeReady
          ><div class="panel-body">
            <article class="preview-card">
              <h3>Selected theme preview</h3>
              <button class="primary-btn">Create something</button><input
                class="preview-input"
                aria-label="Simulation input"
                placeholder="Your input shape"
              />
              <div class="role-samples">
                <span class="secondary-sample">Secondary</span><span
                  class="accent-sample">Accent</span
                >
              </div>
            </article>
            <ThemePalette /><span class="status">Theme available</span>
          </div></ThemeReady
        ></ThemeProvider
      >{/key}
  </div>
  <div class="suggestions" style="margin-top:12px">
    <button
      onclick={() => {
        fail = false;
        version++;
      }}>Simulate success</button
    ><button
      onclick={() => {
        fail = true;
        version++;
      }}>Simulate failure</button
    >
  </div>
  <footer>Independent context per provider · No shared server state</footer>
</main>
