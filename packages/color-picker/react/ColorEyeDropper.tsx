'use client';
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from 'react';
import {
  createColorEyeDropper,
  type ColorEyeDropperController,
  type ColorEyeDropperState,
} from '../core';
import { useColor, useColorStore } from './context';
export interface ColorEyeDropperProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  preserveAlpha?: boolean;
  onPick?: (hex: string) => void;
  onPickError?: (error: Error) => void;
  render?: (state: ColorEyeDropperState) => React.ReactNode;
}
export const ColorEyeDropper = forwardRef<
  HTMLButtonElement,
  ColorEyeDropperProps
>(function ColorEyeDropper(
  {
    preserveAlpha = true,
    onPick,
    onPickError,
    render,
    children,
    disabled = false,
    onClick,
    ...attributes
  },
  ref,
) {
  const store = useColorStore(),
    color = useColor(),
    controller = useRef<ColorEyeDropperController>();
  const [state, setState] = useState<ColorEyeDropperState>({
    supported: false,
    pending: false,
    error: undefined,
  });
  useEffect(() => {
    const eye = createColorEyeDropper(store);
    controller.current = eye;
    const stop = eye.subscribe(() => setState(eye.getSnapshot()));
    eye.mount();
    return () => {
      stop();
      eye.destroy();
      controller.current = undefined;
    };
  }, [store]);
  useEffect(() => {
    if (disabled) controller.current?.cancel();
  }, [disabled]);
  return (
    <button
      type="button"
      aria-label="Pick color from screen"
      {...attributes}
      ref={ref}
      disabled={disabled || color.disabled || !state.supported || state.pending}
      data-cp-part="eyedropper"
      data-cp-supported={state.supported}
      aria-busy={state.pending}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        void controller.current
          ?.pick({ preserveAlpha })
          .then((hex) => {
            if (hex) onPick?.(hex);
          })
          .catch((error) => onPickError?.(error));
      }}
    >
      {render ? render(state) : (children ?? 'Pick from screen')}
    </button>
  );
});
