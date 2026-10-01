import type { ColorStore, ColorSnapshot } from './picker';
import { hsvToHex } from './color';
import { colorContrast } from './contrast';
export interface ColorPartClasses {
  root?: string;
  thumb?: string;
  marker?: string;
  text?: string;
  label?: string;
  track?: string;
  input?: string;
}
export type SliderChannel = 'h' | 's' | 'v' | 'alpha';
export const sliderLabels = {
  h: 'Hue',
  s: 'Saturation',
  v: 'Brightness',
  alpha: 'Alpha',
};
export const sliderValue = (state: ColorSnapshot, channel: SliderChannel) =>
  channel === 'alpha' ? state.alpha * 100 : state[channel];
export function setSliderValue(
  store: ColorStore,
  channel: SliderChannel,
  value: number,
): void {
  if (channel === 'alpha') store.setAlpha(value / 100);
  else store.setHSV({ [channel]: value });
}
/** Shared by every adapter. HSV keeps the chosen hue when the color is gray or black. */
export function sliderTrackVariables(
  state: ColorSnapshot,
): Record<string, string> {
  return {
    '--cp-alpha-color': state.hex,
    '--cp-saturation-start': hsvToHex({ ...state, s: 0 }),
    '--cp-saturation-end': hsvToHex({ ...state, s: 100 }),
    '--cp-brightness-end': hsvToHex({ ...state, v: 100 }),
  };
}
const cssVariables = (variables: Record<string, string>) =>
  Object.entries(variables)
    .map(([property, value]) => `${property}:${value}`)
    .join(';');
export function sliderTrackStyle(state: ColorSnapshot): string {
  return cssVariables(sliderTrackVariables(state));
}
/** Text is measured over the preview's opaque checker canvas, including color alpha. */
export function colorPreviewStyles(value: string): Record<string, string> {
  return {
    background: `linear-gradient(${value},${value}),repeating-conic-gradient(#eee 0% 25%,white 0% 50%) 0/12px 12px`,
    color: colorContrast('#000000', value).suggestedForeground,
  };
}
export const colorPreviewStyle = (value: string) =>
  cssVariables(colorPreviewStyles(value));
/** Kept for compositions that only need an alpha track. */
export const alphaTrackStyle = (hex: string) => `--cp-alpha-color:${hex}`;

/** Numeric alpha editor in percent; keeps a draft while editing and validates without clamping. */
export function bindAlphaInput(
  input: HTMLInputElement,
  store: ColorStore,
): () => void {
  let focused = false;
  const render = () => {
    if (!focused) {
      input.value = String(
        Number((store.getSnapshot().alpha * 100).toFixed(1)),
      );
      input.setAttribute('aria-invalid', 'false');
    }
  };
  const change = () => {
    const n = input.valueAsNumber;
    if (input.value !== '' && Number.isFinite(n) && n >= 0 && n <= 100) {
      store.setAlpha(n / 100);
      input.setAttribute('aria-invalid', 'false');
    } else input.setAttribute('aria-invalid', 'true');
  };
  const focus = () => (focused = true);
  const blur = () => {
    focused = false;
    render();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      focused = false;
      render();
      focused = true;
    }
  };
  input.addEventListener('input', change);
  input.addEventListener('focus', focus);
  input.addEventListener('blur', blur);
  input.addEventListener('keydown', key);
  render();
  const unsubscribe = store.subscribe(render);
  return () => {
    unsubscribe();
    input.removeEventListener('input', change);
    input.removeEventListener('focus', focus);
    input.removeEventListener('blur', blur);
    input.removeEventListener('keydown', key);
  };
}
