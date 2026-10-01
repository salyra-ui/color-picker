export * from './elements';
export * from '../core';
import {
  createColorStore,
  subscribeColor,
  type ColorStore,
  type ColorView,
  type ColorFormat,
  type ColorInfo,
} from '../core';
import type { ColorProviderElement } from './elements';
export interface ColorPickerOptions {
  disabled?: boolean;
  value?: string;
  view?: ColorView;
  format?: ColorFormat;
  store?: ColorStore;
  className?: string;
  onChange?: (color: ColorInfo) => void;
}
/** Composable HTML parts can also be placed directly under cp-provider. */
export const colorAreaMarkup = `<cp-area><div class="cp-area" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Saturation and brightness"><span data-cp-part="thumb" aria-hidden="true"></span></div></cp-area>`;
export const colorWheelMarkup = `<cp-wheel><div class="cp-wheel" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Hue and saturation wheel"><span data-cp-part="thumb" aria-hidden="true"></span></div></cp-wheel>`;
export const colorFormatMarkup = `<cp-format-select><label class="cp-format">Color format<select>${['hex', 'rgb', 'hsl', 'hsv', 'oklch', 'oklab'].map((f) => `<option value="${f}">${f.toUpperCase()}</option>`).join('')}</select></label></cp-format-select>`;
export function colorSliderMarkup(
  channel: 'h' | 's' | 'v' | 'alpha',
  label: string = channel,
) {
  // Labels are assigned via textContent by mountColorPicker; this low-level helper escapes HTML.
  const text = label.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
  return `<cp-slider channel="${channel}"><label class="cp-slider" data-channel="${channel}">${text}<input type="range" min="0" max="${channel === 'h' ? 359 : 100}" step="1" /></label></cp-slider>`;
}
export const colorPickerMarkup = `<div class="cp-picker">
  <cp-view-select><label class="cp-format">Picker view<select><option value="area">Rectangle</option><option value="wheel">Wheel</option></select></label></cp-view-select>
  <cp-surface><div data-view="area">${colorAreaMarkup}</div><div data-view="wheel">${colorWheelMarkup}</div></cp-surface>
  ${colorSliderMarkup('h', 'Hue')}${colorSliderMarkup('v', 'Brightness')}${colorSliderMarkup('alpha', 'Alpha')}
  ${colorFormatMarkup}<cp-input></cp-input>
  <cp-alpha-input><label class="cp-channel">Alpha %<input type="number" min="0" max="100" step=".1" /></label></cp-alpha-input>
  <cp-mode><button type="button">Switch format</button></cp-mode>
  <cp-output format="name"><output aria-live="polite"></output></cp-output>
</div>`;
/** Mount one picker; destroy before reusing the same host with a different mount. */
export function mountColorPicker(
  host: HTMLElement,
  options: ColorPickerOptions = {},
) {
  const store =
    options.store ??
    createColorStore(
      options.value,
      options.format,
      options.view,
      options.disabled,
    );
  const provider = host.ownerDocument.createElement(
    'cp-provider',
  ) as ColorProviderElement;
  provider.className = options.className ?? '';
  if (options.disabled !== undefined) store.setDisabled(options.disabled);
  provider.setStore(store);
  provider.innerHTML = colorPickerMarkup;
  const change = () => options.onChange?.(store.getColor());
  provider.addEventListener('color-change', change);
  host.append(provider);
  change();
  return {
    element: provider,
    store,
    getColor: store.getColor,
    getValue: store.getValue,
    destroy() {
      provider.removeEventListener('color-change', change);
      provider.remove();
    },
  };
}

/** Custom classes style the list and buttons while their fill remains the selected color. */
export function mountColorCollection(
  host: HTMLElement,
  store: ColorStore,
  collection: import('../core').ColorCollectionStore,
  options: {
    kind?: 'recent' | 'favorites';
    label?: string;
    classes?: import('../core').ColorCollectionClasses;
    renderLabel?: (color: string) => string;
  } = {},
) {
  const root = host.ownerDocument.createElement('fieldset');
  root.className = `cp-collection ${options.classes?.root ?? ''}`;
  const legend = host.ownerDocument.createElement('legend');
  legend.className = options.classes?.label ?? '';
  legend.textContent =
    options.label ??
    (options.kind === 'favorites' ? 'Favorite colors' : 'Recent colors');
  const update = () => {
    root.replaceChildren(legend);
    for (const value of collection.getSnapshot()[options.kind ?? 'recent']) {
      const button = host.ownerDocument.createElement('button');
      button.type = 'button';
      button.className = `cp-swatch ${options.classes?.item ?? ''}`;
      button.style.background = value;
      button.setAttribute('aria-label', value);
      button.textContent = options.renderLabel?.(value) ?? '';
      button.addEventListener('click', () => store.setHex(value));
      root.append(button);
    }
  };
  update();
  root.disabled = store.getSnapshot().disabled;
  host.append(root);
  const stopCollection = collection.subscribe(update),
    stopColor = store.subscribe(() => {
      root.disabled = store.getSnapshot().disabled;
    });
  return {
    element: root,
    destroy() {
      stopCollection();
      stopColor();
      root.remove();
    },
  };
}
