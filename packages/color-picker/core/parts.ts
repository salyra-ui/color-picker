import type { ColorStore, ColorSnapshot } from './picker';
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
        Number((store.getSnapshot().alpha * 100).toFixed(4)),
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
