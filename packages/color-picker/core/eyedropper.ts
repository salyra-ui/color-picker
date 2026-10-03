import { withAlpha } from './color';
import type { ColorStore } from './picker';

export interface ColorEyeDropperState {
  readonly supported: boolean;
  readonly pending: boolean;
  readonly error: Error | undefined;
}
export interface ColorEyeDropperOptions {
  /** Keep the opacity being edited. Screen pixels supply opaque sRGB only. */
  preserveAlpha?: boolean;
}
export interface EyeDropperHost {
  isSecureContext?: boolean;
  EyeDropper?: new () => {
    open(options: { signal: AbortSignal }): Promise<{ sRGBHex: string }>;
  };
}
export function isEyeDropperSupported(
  host: EyeDropperHost = globalThis as EyeDropperHost,
) {
  return (
    host.isSecureContext !== false && typeof host.EyeDropper === 'function'
  );
}
/** Create per control. mount() detects support after hydration. pick() must run from a user gesture. */
export function createColorEyeDropper(
  store: ColorStore,
  host?: EyeDropperHost,
) {
  let state: ColorEyeDropperState = Object.freeze({
    supported: false,
    pending: false,
    error: undefined,
  });
  let operation = 0,
    abort: AbortController | undefined,
    stop: (() => void) | undefined,
    destroyed = false;
  const listeners = new Set<() => void>();
  const environment = () => host ?? (globalThis as EyeDropperHost);
  const update = (next: Partial<ColorEyeDropperState>) => {
    state = Object.freeze({ ...state, ...next });
    listeners.forEach((fn) => fn());
  };
  const cancel = () => {
    operation++;
    abort?.abort();
    abort = undefined;
    if (state.pending) update({ pending: false });
  };
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    mount() {
      if (destroyed) throw new Error('Eye dropper has been destroyed');
      update({ supported: isEyeDropperSupported(environment()) });
      stop ??= store.subscribe(() => {
        if (store.getSnapshot().disabled) cancel();
      });
    },
    async pick(
      options: ColorEyeDropperOptions = {},
    ): Promise<string | undefined> {
      if (destroyed || state.pending || store.getSnapshot().disabled) return;
      const target = environment();
      if (!isEyeDropperSupported(target)) {
        const error = new Error(
          'Screen color picking is not available in this browser',
        );
        error.name = 'NotSupportedError';
        update({ supported: false, error });
        throw error;
      }
      const current = ++operation;
      const request = (abort = new AbortController());
      update({ supported: true, pending: true, error: undefined });
      try {
        // Call open synchronously before awaiting, preserving the browser's user activation.
        const result = await new target.EyeDropper!().open({
          signal: request.signal,
        });
        if (
          destroyed ||
          request.signal.aborted ||
          current !== operation ||
          store.getSnapshot().disabled
        )
          return;
        if (!/^#[\da-f]{6}$/i.test(result.sRGBHex))
          throw new TypeError('Invalid screen color');
        const hex = result.sRGBHex.toUpperCase();
        store.setHex(
          options.preserveAlpha === false
            ? hex
            : withAlpha(hex, store.getSnapshot().alpha),
        );
        return hex;
      } catch (cause) {
        if (
          destroyed ||
          request.signal.aborted ||
          current !== operation ||
          (cause as Error)?.name === 'AbortError'
        )
          return;
        const error = cause instanceof Error ? cause : new Error(String(cause));
        update({ error });
        throw error;
      } finally {
        if (current === operation) {
          abort = undefined;
          update({ pending: false });
        }
      }
    },
    cancel,
    destroy() {
      cancel();
      stop?.();
      stop = undefined;
      destroyed = true;
      listeners.clear();
    },
  };
}
export type ColorEyeDropperController = ReturnType<
  typeof createColorEyeDropper
>;
export interface ColorEyeDropperBindingOptions extends ColorEyeDropperOptions {
  disabled?: () => boolean;
  onPick?: (hex: string) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: ColorEyeDropperState) => void;
}
/** Attach to your own button without replacing its classes or content. */
export function bindColorEyeDropper(
  button: HTMLButtonElement,
  store: ColorStore,
  options: ColorEyeDropperBindingOptions = {},
) {
  const controller = createColorEyeDropper(
    store,
    button.ownerDocument.defaultView as EyeDropperHost | undefined,
  );
  const ownDisabled =
    button.disabled && !button.hasAttribute('data-cp-supported');
  let disposed = false;
  const EventConstructor = button.ownerDocument.defaultView!.CustomEvent;
  const refresh = () => {
    const state = controller.getSnapshot();
    const disabled = ownDisabled || (options.disabled?.() ?? false);
    if (disabled && state.pending) {
      controller.cancel();
      return;
    }
    button.disabled =
      disabled ||
      store.getSnapshot().disabled ||
      !state.supported ||
      state.pending;
    button.dataset.cpPart = 'eyedropper';
    button.dataset.cpSupported = String(state.supported);
    button.setAttribute('aria-busy', String(state.pending));
    options.onStateChange?.(state);
  };
  const stop = controller.subscribe(refresh),
    stopColor = store.subscribe(refresh);
  const click = (event: Event) => {
    if (event.defaultPrevented || button.disabled) return;
    void controller
      .pick(options)
      .then((hex) => {
        if (hex && !disposed) {
          options.onPick?.(hex);
          button.dispatchEvent(
            new EventConstructor('color-pick', {
              detail: { hex },
              bubbles: true,
            }),
          );
        }
      })
      .catch((error) => {
        if (disposed) return;
        options.onError?.(error);
        button.dispatchEvent(
          new EventConstructor('color-pick-error', {
            detail: error,
            bubbles: true,
          }),
        );
      });
  };
  button.addEventListener('click', click);
  controller.mount();
  return {
    controller,
    refresh,
    destroy() {
      disposed = true;
      stop();
      stopColor();
      controller.destroy();
      button.removeEventListener('click', click);
      button.disabled = ownDisabled;
    },
  };
}
