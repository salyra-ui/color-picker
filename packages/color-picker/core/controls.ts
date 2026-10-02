/** Headless native controls shared by every adapter. No labels, layout or stylesheet. */
import {
  colorFormats,
  formatColor,
  parseColor,
  type ColorFormat,
} from './color';
import {
  bindColorArea,
  type ColorStore,
  type ColorSnapshot,
  type ColorView,
} from './picker';
import {
  channelSpecs,
  channelValue,
  setColorChannel,
  type ChannelFormat,
  type ChannelIndex,
} from './channels';
import {
  sliderTrackVariables,
  sliderValue,
  setSliderValue,
  type SliderChannel,
} from './parts';

export function surfaceStyles(
  state: ColorSnapshot,
  view: ColorView,
): Record<string, string> {
  return {
    position: 'relative',
    touchAction: 'none',
    ...(view === 'wheel'
      ? {
          aspectRatio: '1',
          borderRadius: '50%',
          background: `var(--cp-wheel-background,linear-gradient(rgba(0,0,0,${1 - state.v / 100}),rgba(0,0,0,${1 - state.v / 100})),radial-gradient(closest-side,white,transparent),conic-gradient(from 90deg,red,yellow,lime,cyan,blue,magenta,red))`,
        }
      : {
          background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl(${state.h} 100% 50%)`,
        }),
  };
}
export function thumbPosition(
  state: Pick<ColorSnapshot, 'h' | 's' | 'v'>,
  view: ColorView,
): Record<string, string> {
  const a = (state.h * Math.PI) / 180;
  return {
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    pointerEvents: 'none',
    left: `${view === 'wheel' ? 50 + (Math.cos(a) * state.s) / 2 : state.s}%`,
    top: `${view === 'wheel' ? 50 + (Math.sin(a) * state.s) / 2 : 100 - state.v}%`,
  };
}
export function styleText(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(
      ([key, value]) =>
        `${key.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase())}:${value}`,
    )
    .join(';');
}
export function sliderAttributes(state: ColorSnapshot, channel: SliderChannel) {
  return {
    type: 'range' as const,
    min: 0,
    max: channel === 'h' ? 359 : 100,
    step: channel === 'alpha' ? 0.1 : 1,
    value: sliderValue(state, channel),
    disabled: state.disabled,
  };
}
/** Subscription selectors avoid notifying controls when unrelated snapshot fields change. */
export function subscribeColorSelector<T>(
  store: ColorStore,
  select: (state: ColorSnapshot) => T,
  listener: (value: T) => void,
  equal: (a: T, b: T) => boolean = Object.is,
): () => void {
  let previous = select(store.getSnapshot());
  return store.subscribe(() => {
    const next = select(store.getSnapshot());
    if (!equal(previous, next)) {
      previous = next;
      listener(next);
    }
  });
}
export function bindColorSlider(
  input: HTMLInputElement,
  store: ColorStore,
  channel: SliderChannel,
  isDisabled?: () => boolean,
): () => void {
  // Provider-owned disabled flags must not become a permanent local setting.
  const ownDisabled =
    input.disabled &&
    !input.hasAttribute('data-cp-disabled') &&
    !input.hasAttribute('data-tk-disabled');
  const localDisabled = isDisabled ?? (() => ownDisabled);
  const render = () => {
    const state = store.getSnapshot();
    input.value = String(sliderValue(state, channel));
    input.disabled = localDisabled() || state.disabled;
    for (const [key, value] of Object.entries(sliderTrackVariables(state)))
      input.style.setProperty(key, value);
  };
  const change = (event: Event) => {
    if (
      !event.defaultPrevented &&
      !input.disabled &&
      !store.getSnapshot().disabled
    )
      setSliderValue(store, channel, input.valueAsNumber);
  };
  input.addEventListener('input', change);
  render();
  const stop = store.subscribe(render);
  return () => {
    stop();
    input.removeEventListener('input', change);
    input.disabled = ownDisabled;
  };
}
export type ColorInputOptions = { format?: ColorFormat; index?: ChannelIndex };
/** Keeps incomplete input local. Enter/Escape/blur restore the current valid store value. */
export function bindColorValueInput(
  input: HTMLInputElement,
  store: ColorStore,
  options: ColorInputOptions = {},
  isDisabled?: () => boolean,
): () => void {
  let focused = false;
  // Provider-owned disabled flags must not become a permanent local setting.
  const ownDisabled =
    input.disabled &&
    !input.hasAttribute('data-cp-disabled') &&
    !input.hasAttribute('data-tk-disabled');
  const localDisabled = isDisabled ?? (() => ownDisabled);
  const format = () => options.format ?? store.getSnapshot().format;
  const render = () => {
    const state = store.getSnapshot();
    input.disabled = localDisabled() || state.disabled;
    if (focused) return;
    input.value =
      options.index === undefined
        ? formatColor(state.hex, format(), state.alpha)
        : channelValue(state, format() as ChannelFormat, options.index);
    input.setAttribute('aria-invalid', 'false');
  };
  if (
    options.index !== undefined &&
    (!options.format || options.format === 'hex')
  )
    throw new TypeError('Channel inputs require a non-hex format');
  const change = (event: Event) => {
    if (
      event.defaultPrevented ||
      input.disabled ||
      store.getSnapshot().disabled
    )
      return;
    try {
      if (!input.value.trim()) throw new Error('Incomplete input');
      if (options.index === undefined)
        store.setHex(parseColor(input.value, format()));
      else
        setColorChannel(
          store,
          format() as ChannelFormat,
          options.index,
          Number(input.value),
        );
      input.setAttribute('aria-invalid', 'false');
    } catch {
      input.setAttribute('aria-invalid', 'true');
    }
  };
  const focus = () => {
    focused = true;
  };
  const blur = () => {
    focused = false;
    render();
  };
  const key = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (event.key === 'Enter' || event.key === 'Escape') {
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
  const stop = store.subscribe(render);
  return () => {
    stop();
    input.removeEventListener('input', change);
    input.removeEventListener('focus', focus);
    input.removeEventListener('blur', blur);
    input.removeEventListener('keydown', key);
    input.disabled = ownDisabled;
  };
}
export function colorInputAttributes(
  state: ColorSnapshot,
  options: ColorInputOptions = {},
) {
  if (options.index !== undefined) {
    if (!options.format || options.format === 'hex')
      throw new TypeError('Channel inputs require a non-hex format');
    const spec = channelSpecs[options.format][options.index];
    return {
      type: 'number' as const,
      min: spec.min,
      max: spec.max,
      step: spec.step,
      value: channelValue(state, options.format, options.index),
      disabled: state.disabled,
      'aria-label': `${options.format.toUpperCase()} ${spec.label}`,
    };
  }
  return {
    type: 'text' as const,
    value: formatColor(state.hex, options.format ?? state.format, state.alpha),
    disabled: state.disabled,
    'aria-label': (options.format ?? state.format).toUpperCase(),
  };
}
export function nextColorFormat(store: ColorStore, format?: ColorFormat): void {
  if (store.getSnapshot().disabled) return;
  store.setFormat(
    format ??
      colorFormats[
        (colorFormats.indexOf(store.getSnapshot().format) + 1) %
          colorFormats.length
      ],
  );
}
/** Direct DOM composition without custom elements or any framework. */
export function bindColorSurface(
  element: HTMLElement,
  store: ColorStore,
  view: ColorView = 'area',
): () => void {
  element.dataset.cpPart = 'surface';
  element.dataset.view = view;
  const render = () => {
    const state = store.getSnapshot();
    for (const [key, value] of Object.entries(surfaceStyles(state, view)))
      element.style.setProperty(
        key.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase()),
        value,
      );
    element.setAttribute('aria-disabled', String(state.disabled));
    element.tabIndex = state.disabled ? -1 : 0;
    for (const thumb of element.querySelectorAll<HTMLElement>(
      '[data-cp-part="thumb"]',
    )) {
      if (thumb.closest('[data-cp-part="surface"]') !== element) continue;
      for (const [key, value] of Object.entries(thumbPosition(state, view)))
        thumb.style.setProperty(
          key.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase()),
          value,
        );
    }
  };
  render();
  const stop = store.subscribe(render),
    unbind = bindColorArea(element, store, view);
  return () => {
    stop();
    unbind();
  };
}
