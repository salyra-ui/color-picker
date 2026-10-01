import {
  normalizeHex,
  opaqueHex,
  hexAlpha,
  withAlpha,
  normalizeColorHex,
  colorFormats,
  type ColorFormat,
  clamp,
  colorAtPoint,
  hexToHsv,
  hsvToHex,
  hue,
  type HSV,
} from './color';
import {
  getColor,
  getColorValue,
  type ColorInfo,
  type ColorValues,
} from './values';
export interface ColorSnapshot extends Readonly<HSV> {
  /** Opaque RGB base. Use value for the RGBA hex result. */
  readonly hex: string;
  readonly value: string;
  readonly alpha: number;
  readonly format: ColorFormat;
  readonly view: ColorView;
  readonly disabled: boolean;
}
export const colorViews = ['area', 'wheel'] as const;
export type ColorView = (typeof colorViews)[number];
export interface ColorStore {
  getColor(): ColorInfo;
  getValue<F extends ColorFormat>(format: F): ColorValues[F];
  getSnapshot(): ColorSnapshot;
  getServerSnapshot(): ColorSnapshot;
  subscribe(listener: () => void): () => void;
  setDisabled(disabled: boolean): void;
  setHex(hex: string): void;
  setFormat(format: ColorFormat): void;
  setView(view: ColorView): void;
  setAlpha(alpha: number): void;
  setHSV(hsv: Partial<HSV>): void;
}
export function createColorStore(
  hex = '#6366F1',
  format: ColorFormat = 'hex',
  view: ColorView = 'area',
  disabled = false,
): ColorStore {
  if (!colorViews.includes(view)) throw new TypeError('Invalid color view');
  if (!colorFormats.includes(format))
    throw new TypeError('Unknown color format');
  const initial = hexToHsv(hex);
  const alpha = hexAlpha(hex);
  let state: ColorSnapshot = Object.freeze({
    ...initial,
    disabled,
    format,
    view,
    hex: hsvToHex(initial),
    value: withAlpha(hsvToHex(initial), alpha),
    alpha,
  });
  const server = state,
    listeners = new Set<() => void>();
  const update = (hsv: HSV) => {
    const next = { h: hue(hsv.h), s: clamp(hsv.s), v: clamp(hsv.v) };
    if (next.h === state.h && next.s === state.s && next.v === state.v) return;
    state = Object.freeze({
      ...state,
      ...next,
      hex: hsvToHex(next),
      value: withAlpha(hsvToHex(next), state.alpha),
      alpha: state.alpha,
      format: state.format,
      view: state.view,
    });
    listeners.forEach((fn) => fn());
  };
  return {
    setDisabled(disabled) {
      if (disabled === state.disabled) return;
      state = Object.freeze({ ...state, disabled });
      listeners.forEach((fn) => fn());
    },
    getColor: () => getColor(state.hex, state.alpha),
    getValue: (format) => getColorValue(state.hex, format, state.alpha),
    getSnapshot: () => state,
    getServerSnapshot: () => server,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    setFormat(format) {
      if (!colorFormats.includes(format))
        throw new TypeError('Unknown color format');
      if (format === state.format) return;
      state = Object.freeze({ ...state, format });
      listeners.forEach((fn) => fn());
    },
    setView(view) {
      if (!colorViews.includes(view)) throw new TypeError('Invalid color view');
      if (state.view === view) return;
      state = Object.freeze({ ...state, view });
      listeners.forEach((fn) => fn());
    },
    setHex(hex) {
      const value = normalizeColorHex(hex),
        alpha = hexAlpha(value),
        rgb = opaqueHex(value);
      if (rgb === state.hex && alpha === state.alpha) return;
      const next =
        rgb === state.hex
          ? { h: state.h, s: state.s, v: state.v }
          : hexToHsv(rgb, state.h);
      state = Object.freeze({
        ...state,
        ...next,
        hex: rgb,
        alpha,
        value: withAlpha(rgb, alpha),
      });
      listeners.forEach((fn) => fn());
    },
    setAlpha(alpha) {
      if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
        throw new TypeError('Alpha must be between 0 and 1');
      if (alpha === state.alpha) return;
      state = Object.freeze({
        ...state,
        alpha,
        value: withAlpha(state.hex, alpha),
      });
      listeners.forEach((fn) => fn());
    },
    setHSV(hsv) {
      update({ ...state, ...hsv });
    },
  };
}
/** Shared controller for pointer capture, touch, keyboard and frame batching. DOM access is mount-only. */
export function bindColorArea(
  element: HTMLElement,
  store: ColorStore,
  mode: 'area' | 'wheel' = 'area',
): () => void {
  let pointer: number | undefined,
    frame: number | undefined,
    pending: HSV | undefined;
  const view = element.ownerDocument.defaultView!;
  const flush = () => {
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    frame = undefined;
    if (pending) {
      if (!store.getSnapshot().disabled) store.setHSV(pending);
      pending = undefined;
    }
  };
  const read = (event: PointerEvent) => {
    if (store.getSnapshot().disabled) return;
    const rect = element.getBoundingClientRect();
    pending =
      mode === 'wheel'
        ? wheelAtPoint(
            store.getSnapshot(),
            event.clientX - rect.left,
            event.clientY - rect.top,
            rect.width,
            rect.height,
          )
        : colorAtPoint(
            store.getSnapshot().h,
            event.clientX - rect.left,
            event.clientY - rect.top,
            rect.width,
            rect.height,
          );
    if (frame === undefined) frame = view.requestAnimationFrame(flush);
  };
  const down = (event: PointerEvent) => {
    if (
      store.getSnapshot().disabled ||
      pointer !== undefined ||
      event.button !== 0 ||
      !event.isPrimary
    )
      return;
    event.preventDefault();
    element.focus();
    pointer = event.pointerId;
    element.setPointerCapture(pointer);
    read(event);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId === pointer) read(event);
  };
  const end = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    read(event);
    flush();
    pointer = undefined;
  };
  const cancel = () => {
    flush();
    pointer = undefined;
  };
  const key = (event: KeyboardEvent) => {
    if (store.getSnapshot().disabled) return;
    const { h, s, v } = store.getSnapshot(),
      step = event.shiftKey ? 10 : 1;
    const changes: Record<string, Partial<HSV>> = mode === 'wheel'
      ? {
          ArrowLeft: { h: h - step },
          ArrowRight: { h: h + step },
          ArrowUp: { s: s + step },
          ArrowDown: { s: s - step },
          Home: { s: 0 },
          End: { s: 100 },
        }
      : {
          ArrowLeft: { s: s - step },
          ArrowRight: { s: s + step },
          ArrowUp: { v: v + step },
          ArrowDown: { v: v - step },
          Home: { s: 0 },
          End: { s: 100 },
        };
    if (changes[event.key]) {
      event.preventDefault();
      store.setHSV(changes[event.key]);
    }
  };
  element.addEventListener('pointerdown', down);
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', end);
  element.addEventListener('pointercancel', cancel);
  element.addEventListener('lostpointercapture', cancel);
  element.addEventListener('keydown', key);
  return () => {
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    if (pointer !== undefined && element.hasPointerCapture(pointer))
      element.releasePointerCapture(pointer);
    element.removeEventListener('pointerdown', down);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    element.removeEventListener('pointercancel', cancel);
    element.removeEventListener('lostpointercapture', cancel);
    element.removeEventListener('keydown', key);
  };
}
export function wheelAtPoint(
  state: HSV,
  x: number,
  y: number,
  width: number,
  height: number,
): HSV {
  const dx = x - width / 2,
    dy = y - height / 2,
    radius = Math.min(width, height) / 2;
  return {
    h:
      dx === 0 && dy === 0
        ? state.h
        : hue((Math.atan2(dy, dx) * 180) / Math.PI),
    s: radius > 0 ? clamp((Math.hypot(dx, dy) / radius) * 100) : 0,
    v: state.v,
  };
}
export function wheelStyle(state: HSV): string {
  return `position:relative;touch-action:none;width:100%;aspect-ratio:1;border-radius:50%;background:var(--cp-wheel-background,linear-gradient(rgba(0,0,0,${1 - state.v / 100}),rgba(0,0,0,${1 - state.v / 100})),radial-gradient(closest-side,white,transparent),conic-gradient(from 90deg,red,yellow,lime,cyan,blue,magenta,red))`;
}
export function wheelThumbStyle(state: HSV): string {
  const a = (state.h * Math.PI) / 180;
  return `position:absolute;left:${50 + (Math.cos(a) * state.s) / 2}%;top:${50 + (Math.sin(a) * state.s) / 2}%;transform:translate(-50%,-50%);width:var(--cp-thumb-size,12px);height:var(--cp-thumb-size,12px);border:var(--cp-thumb-border,2px solid white);box-shadow:var(--cp-thumb-shadow,0 0 0 1px #000);border-radius:var(--cp-thumb-radius,50%);pointer-events:none;display:grid;place-items:center;color:var(--cp-thumb-text-color,white);font-size:var(--cp-thumb-text-size,10px)`;
}
export function areaStyle(state: ColorSnapshot): string {
  return `background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl(${state.h} 100% 50%);position:relative;touch-action:none;min-height:var(--cp-area-height,180px);min-width:0;width:100%`;
}
export function thumbStyle(state: ColorSnapshot): string {
  return `position:absolute;left:${state.s}%;top:${100 - state.v}%;transform:translate(-50%,-50%);width:var(--cp-thumb-size,12px);height:var(--cp-thumb-size,12px);border:var(--cp-thumb-border,2px solid white);box-shadow:var(--cp-thumb-shadow,0 0 0 1px #000);border-radius:var(--cp-thumb-radius,50%);pointer-events:none;display:grid;place-items:center;color:var(--cp-thumb-text-color,white);font-size:var(--cp-thumb-text-size,10px)`;
}

/** Subscribe only to actual color changes, not format or achromatic hue changes. */
export function subscribeColor(
  store: ColorStore,
  onChange: (hex: string) => void,
): () => void {
  let last = store.getSnapshot().value;
  return store.subscribe(() => {
    const hex = store.getSnapshot().value;
    if (hex !== last) {
      last = hex;
      onChange(hex);
    }
  });
}
