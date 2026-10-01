import { colorFormats, formatColor, type ColorFormat } from './color';
import type { ColorStore } from './picker';

export interface ColorFormOptions {
  name: string;
  format?: ColorFormat;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  validate?: (value: string) => string | undefined;
}
/** Mount-only form bridge. Adds one successful form control and supports native reset/validation. */
export function bindColorForm(
  root: HTMLElement,
  store: ColorStore,
  options: ColorFormOptions,
) {
  if (!options.name) throw new TypeError('Color field name is required');
  const format = options.format ?? 'hex';
  if (!colorFormats.includes(format))
    throw new TypeError('Invalid form color format');
  const input = root.ownerDocument.createElement('input');
  // Hidden inputs skip constraint validation. An offscreen text input participates in it.
  input.type = 'text';
  input.name = options.name;
  input.required = options.required ?? false;
  input.tabIndex = -1;
  input.setAttribute('aria-label', options.name);
  input.style.cssText =
    'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;clip-path:inset(50%)';
  root.append(input);
  const initial = options.defaultValue ?? store.getSnapshot().value;
  const update = () => {
    const s = store.getSnapshot();
    input.value =
      format === 'hex' ? s.value : formatColor(s.hex, format, s.alpha);
    input.disabled = options.disabled === true || s.disabled;
    input.setCustomValidity(options.validate?.(input.value) ?? '');
  };
  update();
  const unsubscribe = store.subscribe(update);
  const form = input.form;
  let disposed = false;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const reset = (event: Event) => {
    // A reset listener's microtask can run before the browser resets native controls.
    // Preserve the picker controls, then publish the initial color after that default action.
    const fields = [
      ...root.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        '[data-cp-part="input"], [data-cp-part="track"], [data-cp-part="select"], cp-slider input, cp-alpha-input input, cp-format-select select, cp-view-select select',
      ),
    ].map((field) => [field, field.value] as const);
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (disposed || event.defaultPrevented) return;
      fields.forEach(([field, value]) => {
        if (field.isConnected) field.value = value;
      });
      store.setHex(initial);
      update();
    }, 0);
    timers.add(timer);
  };
  const invalid = () =>
    root
      .querySelector<HTMLElement>(
        'input:not([tabindex="-1"]):not([type=hidden]), [data-area]',
      )
      ?.focus();
  input.addEventListener('invalid', invalid);
  form?.addEventListener('reset', reset);
  return {
    input,
    getValue: () => input.value,
    destroy() {
      disposed = true;
      timers.forEach(clearTimeout);
      timers.clear();
      unsubscribe();
      form?.removeEventListener('reset', reset);
      input.removeEventListener('invalid', invalid);
      input.remove();
    },
  };
}
