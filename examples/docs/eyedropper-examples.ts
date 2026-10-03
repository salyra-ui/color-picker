import { bindColorEyeDropper, type ColorStore } from '@salyra-ui/color-picker';
import type { Integration } from './snippets';
const icon =
  '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="m15 5 4 4M14 6 4 16v4h4L18 10m-4-4 3-3a2.8 2.8 0 0 1 4 4l-3 3" /></svg>';
const layout = `.screen-picker { display: grid; gap: 16px; max-width: 360px; }
.screen-picker label { display: grid; gap: 8px; }
.screen-picker p { margin: 0; font-size: 13px; line-height: 1.6; }
.screen-picker input { width: 100%; box-sizing: border-box; accent-color: #e4002b; }
.screen-picker input:not([type="range"]) { padding: 10px 12px; border: 1px solid #d8d8df; border-radius: 4px; }
.screen-picker button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border: 1px solid #d8d8df; background: white; color: #171717; font: inherit; cursor: pointer; }
.screen-picker button:disabled { opacity: .45; cursor: default; }
.screen-picker .pixel-button { border-color: #e4002b; background: #e4002b; color: white; border-radius: 24px; }
.screen-picker [role="alert"]:empty { display: none; }
.screen-picker .sampling-help { margin: 0; font-size: 12px; line-height: 1.6; color: #666; }`;
const help =
  'Available from 1.0.1. Requires EyeDropper support and HTTPS or localhost. Escape cancels without changing the color.';
const buttonContent = (custom: boolean) =>
  custom ? `${icon}<span>Sample a pixel</span>` : 'Pick from screen';
export function eyedropperMarkup(custom: boolean) {
  return `<cp-provider class="screen-picker" value="#5268E080">
  <cp-input format="hex"></cp-input>
  <cp-slider channel="alpha"><label>Opacity<input type="range" min="0" max="100" /></label></cp-slider>
  <button type="button" data-screen-sample class="${custom ? 'pixel-button' : ''}">${buttonContent(custom)}</button>
  <p data-screen-status role="status" aria-live="polite"></p>
  <p data-screen-error role="alert"></p>
  <p class="sampling-help">${help} ${custom ? 'This example makes sampled colors opaque.' : 'This example preserves your opacity.'}</p>
</cp-provider>`;
}
export function mountEyeDropperExample(
  root: HTMLElement,
  store: ColorStore,
  custom: boolean,
) {
  const status = root.querySelector<HTMLElement>('[data-screen-status]')!,
    error = root.querySelector<HTMLElement>('[data-screen-error]')!;
  const binding = bindColorEyeDropper(
    root.querySelector<HTMLButtonElement>('[data-screen-sample]')!,
    store,
    {
      preserveAlpha: !custom,
      onStateChange(state) {
        status.textContent = !state.supported
          ? 'Screen sampling is unavailable in this browser.'
          : state.pending
            ? 'Pick a pixel from your screen. Press Escape to cancel.'
            : 'Ready to sample a color.';
        error.textContent = state.error?.message ?? '';
      },
      onPick(hex) {
        status.textContent = `Sampled ${hex}.`;
      },
    },
  );
  return binding.destroy;
}
export function eyedropperExample(integration: Integration, custom: boolean) {
  const pkg = '@salyra-ui/color-picker/' + integration.toLowerCase(),
    preserve = !custom,
    className = custom ? 'pixel-button' : '',
    children = buttonContent(custom);
  const css =
    integration === 'Svelte'
      ? layout.replace(
          /^\.screen-picker (.+?) \{/gm,
          '.screen-picker :global($1) {',
        )
      : layout;
  const note = `<p class="sampling-help">${help} ${custom ? 'Sampled colors are opaque.' : 'Existing opacity is preserved.'}</p>`;
  if (integration === 'React')
    return `import { useState } from 'react';
import { ColorRoot, ColorField, ColorRange, ColorEyeDropper, createColorStore } from '${pkg}';
export function ScreenPicker() {
  const [store] = useState(() => createColorStore('#5268E080'));
  const [error, setError] = useState('');
  return <ColorRoot store={store}>
    <section className="screen-picker">
      <label>Color<ColorField format="hex" /></label>
      <label>Opacity<ColorRange channel="alpha" /></label>
      <ColorEyeDropper className="${className}" preserveAlpha={${preserve}}
        onPick={() => setError('')} onPickError={error => setError(error.message)}>
        ${children}
      </ColorEyeDropper>
      <p role="alert">{error}</p>
      ${note.replace('class=', 'className=')}
    </section>
  </ColorRoot>;
}
/* Add to your stylesheet: */
${layout}`;
  if (integration === 'Svelte')
    return `<script lang="ts">
  import { ColorRoot, ColorField, ColorRange, ColorEyeDropper, createColorStore } from '${pkg}';
  const store = createColorStore('#5268E080');
  let error = $state('');
</script>
<ColorRoot {store}>
  <section class="screen-picker">
    <label>Color<ColorField format="hex" /></label>
    <label>Opacity<ColorRange channel="alpha" /></label>
    <ColorEyeDropper class="${className}" preserveAlpha={${preserve}}
      onPick={() => error = ''} onPickError={cause => error = cause.message}>
      ${children}
    </ColorEyeDropper>
    <p role="alert">{error}</p>
    ${note}
  </section>
</ColorRoot>
<style>
${css}
</style>`;
  if (integration === 'Vue')
    return `<script setup lang="ts">
import { ref } from 'vue';
import { ColorRoot, ColorField, ColorRange, ColorEyeDropper, createColorStore } from '${pkg}';
const store = createColorStore('#5268E080');
const error = ref('');
</script>
<template>
  <ColorRoot :store="store">
    <section class="screen-picker">
      <label>Color<ColorField format="hex" /></label>
      <label>Opacity<ColorRange channel="alpha" /></label>
      <ColorEyeDropper class="${className}" :preserve-alpha="${preserve}"
        @pick="error = ''" @pick-error="cause => error = cause.message">
        ${children}
      </ColorEyeDropper>
      <p role="alert">{{ error }}</p>
      ${note}
    </section>
  </ColorRoot>
</template>
<style>
${layout}
</style>`;
  if (integration === 'Angular')
    return `import { Component, signal } from '@angular/core';
import { ColorRoot, ColorField, ColorRange, ColorEyeDropper, createColorStore } from '${pkg}';
@Component({
  selector: 'app-screen-picker', standalone: true,
  imports: [ColorRoot, ColorField, ColorRange, ColorEyeDropper],
  template: \`<section cpRoot [store]="store" class="screen-picker">
    <label>Color<input cpInput format="hex" /></label>
    <label>Opacity<input cpSlider="alpha" /></label>
    <button cpEyeDropper class="${className}" [preserveAlpha]="${preserve}"
      (colorPick)="error.set('')" (colorPickError)="error.set($event.message)">
      ${children}
    </button>
    <p role="alert">{{ error() }}</p>
    ${note}
  </section>\`,
})
export class ScreenPicker {
  readonly store = createColorStore('#5268E080');
  readonly error = signal('');
}
/* Add to your stylesheet: */
${layout}`;
  if (integration === 'Astro')
    return `---
import ColorRoot from '${pkg}/ColorRoot.astro';
import ColorField from '${pkg}/ColorField.astro';
import ColorRange from '${pkg}/ColorRange.astro';
import ColorEyeDropper from '${pkg}/ColorEyeDropper.astro';
const value = '#5268E080';
---
<ColorRoot {value} class="screen-picker">
  <label>Color<ColorField {value} format="hex" /></label>
  <label>Opacity<ColorRange {value} channel="alpha" /></label>
  <ColorEyeDropper class="${className}" preserveAlpha={${preserve}}>
    ${children}
  </ColorEyeDropper>
  <p data-screen-error role="alert"></p>
  ${note}
</ColorRoot>
<script>
  document.querySelectorAll<HTMLElement>('.screen-picker').forEach(root => {
    const error = root.querySelector<HTMLElement>('[data-screen-error]')!;
    root.addEventListener('color-pick-error', event => {
      error.textContent = (event as CustomEvent<Error>).detail.message;
    });
    root.addEventListener('color-pick', () => error.textContent = '');
  });
</script>
<style is:global>
${layout}
</style>`;
  return `<script src="/assets/color-picker.min.js"></script>
${eyedropperMarkup(custom)}
<script>
const root = document.querySelector('.screen-picker');
const store = ColorPicker.createColorStore('#5268E080');
root.setStore(store);
const status = root.querySelector('[data-screen-status]');
const error = root.querySelector('[data-screen-error]');
const binding = ColorPicker.bindColorEyeDropper(root.querySelector('[data-screen-sample]'), store, {
  preserveAlpha: ${preserve},
  onStateChange(state) {
    status.textContent = !state.supported ? 'Screen sampling is unavailable in this browser.'
      : state.pending ? 'Pick a pixel. Press Escape to cancel.' : 'Ready to sample a color.';
    error.textContent = state.error?.message ?? '';
  },
  onPick(hex) { status.textContent = 'Sampled ' + hex + '.'; },
});
window.addEventListener('pagehide', binding.destroy, {once: true});
</script>
<style>
${layout}
</style>`;
}
