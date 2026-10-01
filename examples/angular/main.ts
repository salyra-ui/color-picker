import '@angular/compiler';
import {
  Component,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  ColorSurface,
  ColorViewSelect,
  ColorFormatSelect,
  ColorMode,
  ColorProvider,
  ColorAlphaInput,
  ColorPreview,
  ColorInput,
  ColorSlider,
} from '@salyra-ui/color-picker/angular';
import {
  ThemeSelect,
  ThemeExport,
  ThemePicker,
  ThemeHarmony,
  ThemeRadius,
  ThemeBorderWidth,
  ThemeBackground,
  ThemeProvider,
  ThemeGenerator,
  ThemeMode,
  ThemeName,
  ThemePalette,
  ThemeLoading,
  ThemeReady,
  ThemeError,
} from '@salyra-ui/theme-studio/angular';
import { createThemeStore, generateTheme, type ThemeOptions } from '@salyra-ui/theme-studio';
import '../demo.css';
@Component({
  selector: 'demo-root',
  standalone: true,
  imports: [
    ColorSurface,
    ColorViewSelect,
    ColorFormatSelect,
    ColorMode,
    ColorProvider,
    ColorAlphaInput,
    ColorPreview,
    ColorInput,
    ColorSlider,
    ThemeSelect,
    ThemeExport,
    ThemePicker,
    ThemeHarmony,
    ThemeRadius,
    ThemeBorderWidth,
    ThemeBackground,
    ThemeProvider,
    ThemeMode,
    ThemeName,
    ThemePalette,
    ThemeLoading,
    ThemeReady,
    ThemeError,
  ],
  template: `<nav>
      <strong>theme / kit</strong><span>Angular / standalone components</span>
    </nav>
    <main>
      <div class="eyebrow">Angular 19 / signals</div>
      <h1>Make it<br />your color.</h1>
      <p class="intro">
        A color picker on its own, a theme generator in context. Same engine,
        native Angular components.
      </p>
      <div class="demo-grid">
        <section class="panel">
          <div class="panel-header"><h2>01 / Color picker</h2></div>
          <cp-provider value="#EF6B52"
            ><div class="panel-body">
              <cp-view-select /><cp-surface /><cp-slider
                channel="alpha"
              /><cp-alpha-input /><cp-preview /><cp-format-select /><cp-input /><cp-mode /></div
          ></cp-provider>
        </section>
        <section class="panel">
          <tk-provider [store]="editorStore"
            ><div class="panel-header">
              <h2>02 / Theme generator</h2>
              <tk-mode />
            </div>
            <div class="panel-body">
              <tk-name />
        <tk-select
                [themes]="themes"
              /><tk-picker /><tk-harmony /><tk-background />

              <details class="editor-details">
                <summary>Borders &amp; shape</summary>
                <div class="border-editors">
                  <tk-radius
                    target="card"
                    label="Card radius"
                  /><tk-border-width
                    target="card"
                    label="Card border width"
                  /><tk-radius
                    target="button"
                    label="Button radius"
                  /><tk-border-width
                    target="button"
                    label="Button border width"
                  />
                </div>
              </details>
              <article class="preview-card">
                <h3>A theme that feels like you.</h3>
                <button class="primary-btn">Create something</button
                ><input
                  class="preview-input"
                  aria-label="Preview input"
                  placeholder="Your input shape"
                />
              </article>
              <tk-palette />
              <details class="editor-details">
                <summary>Export configuration</summary>
                <tk-export />
              </details></div
          ></tk-provider>
        </section>
      </div>
      <div class="section-note">03 / Async loading + fallback</div>
      <div class="panel">
        @for (run of runs; track run.id) {
          <tk-provider [options]="run.options"
            ><tk-loading><div class="loading">Loading theme</div></tk-loading
            ><tk-error
              ><div class="error">
                Fetch failed. Selected theme fallback is active.
              </div></tk-error
            ><tk-ready
              ><div class="panel-body">
                <article class="preview-card">
                  <h3>Selected theme preview</h3>
                  <button class="primary-btn">Create something</button
                  ><input class="preview-input" aria-label="Simulation input" />
                </article>
                <tk-palette />Content available
              </div></tk-ready
            ></tk-provider
          >
        }
      </div>
      <div class="suggestions">
        <button (click)="simulate(false)">Simulate success</button
        ><button (click)="simulate(true)">Simulate failure</button>
      </div>
    </main>`,
})
export class App {
  readonly themes = [
    generateTheme('#6366F1', { name: 'Indigo' }),
    generateTheme('#ef6b52', { name: 'Coral' }),
    generateTheme('#277d59', { name: 'Forest' }),
  ];
  readonly editorStore = createThemeStore({ theme: this.themes[0] });
  private version = 0;
  private simulation(fail: boolean): ThemeOptions {
    const selected = this.editorStore.getSnapshot();
    return {
      fallbackTheme: selected.theme,
      mode: selected.mode,
    modeStorage: false,
      loadTheme: async () => {
        await new Promise((r) => setTimeout(r, 900));
        if (fail) throw new Error('Demo offline');
        return selected.theme;
      },
    };
  }
  runs = [{ id: this.version, options: this.simulation(true) }];
  simulate(fail: boolean) {
    this.runs = [{ id: ++this.version, options: this.simulation(fail) }];
  }
}
bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()],
}).catch(console.error);
