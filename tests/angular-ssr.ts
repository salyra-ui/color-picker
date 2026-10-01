import '@angular/compiler';
import {
  Component,
  InjectionToken,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  renderApplication,
  provideServerRendering,
} from '@angular/platform-server';
import {
  ThemeSelect,
  ThemeExport,
  ThemePicker,
  ThemeHarmony,
  ThemeRadius,
  ThemeProvider,
  ThemeGenerator,
  ThemeLoading,
  ThemeReady,
} from '@salyra-ui/theme-studio/angular';
import { generateTheme, type Theme } from '@salyra-ui/theme-studio';
const INITIAL = new InjectionToken<Theme>('ssr-test-theme');
@Component({
  selector: 'ssr-test',
  standalone: true,
  imports: [
    ThemeSelect,
    ThemeExport,
    ThemePicker,
    ThemeHarmony,
    ThemeRadius,
    ThemeProvider,
    ThemeGenerator,
    ThemeLoading,
    ThemeReady,
  ],
  template: `<tk-provider [options]="options"
    ><tk-loading>LOADING</tk-loading
    ><tk-ready
      ><tk-select [themes]="[options.theme]" /><tk-export
        format="css" /><tk-picker
        view="shared-wheel" /><tk-generator /><tk-generator
        role="accent"
        [wheel]="true" /><tk-harmony /><tk-radius target="card" /></tk-ready
  ></tk-provider>`,
})
class SSRApp {
  readonly options = { theme: inject(INITIAL) };
}
export async function renderAngular(hex: string) {
  return renderApplication(
    (context) =>
      bootstrapApplication(
        SSRApp,
        {
          providers: [
            provideServerRendering(),
            provideExperimentalZonelessChangeDetection(),
            { provide: INITIAL, useValue: generateTheme(hex) },
          ],
        },
        context,
      ),
    {
      document:
        '<!doctype html><html><body><ssr-test></ssr-test></body></html>',
      url: 'http://localhost/',
      allowedHosts: ['localhost'],
    },
  );
}
