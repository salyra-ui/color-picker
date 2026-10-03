'use client';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  bindColorArea,
  bindColorSlider,
  bindColorValueInput,
  bindMarkerWheel,
  colorInputAttributes,
  createColorStore,
  nextColorFormat,
  sliderAttributes,
  sliderLabels,
  sliderTrackVariables,
  subscribeColor,
  surfaceStyles,
  thumbPosition,
  type ColorFormat,
  type ColorInputOptions,
  type ColorSnapshot,
  type ColorStore,
  type ColorView,
  type HSV,
  type ColorMarker as Marker,
  type SliderChannel,
} from '../core';
import { Context, useColor, useColorStore } from './context';

export interface ColorRootProps {
  store?: ColorStore;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}
/** Context only. Arrange its children in any native layout. */
export function ColorRoot({
  store: provided,
  value,
  defaultValue,
  disabled,
  onValueChange,
  children,
}: ColorRootProps) {
  const [store] = useState(() => {
    const initial =
      provided ??
      createColorStore(value ?? defaultValue, 'hex', 'area', disabled);
    if (disabled !== undefined) initial.setDisabled(disabled);
    return initial;
  });
  const latest = useRef(onValueChange);
  latest.current = onValueChange;
  useEffect(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  }, [store, disabled]);
  useEffect(() => {
    if (value !== undefined) store.setHex(value);
  }, [store, value]);
  useEffect(
    () => subscribeColor(store, (hex) => latest.current?.(hex)),
    [store],
  );
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
const SurfaceContext = createContext<ColorView>('area');
export interface ColorPlaneProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect'
> {
  view?: ColorView;
  markers?: readonly Marker[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onMarkerChange?: (id: string, hsv: Partial<HSV>) => void;
}
function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}
/** Only gradients, pointer/keyboard behavior and the geometry context. Children own the thumb. */
export const ColorPlane = forwardRef<HTMLDivElement, ColorPlaneProps>(
  function ColorPlane(
    {
      view = 'area',
      markers,
      activeId,
      onSelect,
      onMarkerChange,
      children,
      style,
      ...attributes
    },
    forwarded,
  ) {
    const store = useColorStore(),
      state = useColor(),
      element = useRef<HTMLDivElement | null>(null);
    const latest = useRef({ markers, activeId, onSelect, onMarkerChange });
    latest.current = { markers, activeId, onSelect, onMarkerChange };
    const multi = markers !== undefined;
    useEffect(
      () =>
        multi
          ? bindMarkerWheel(element.current!, {
              getMarkers: () => latest.current.markers ?? [],
              getActiveId: () =>
                latest.current.activeId ??
                latest.current.markers?.[0]?.id ??
                '',
              select: (id) => latest.current.onSelect?.(id),
              setHSV: (id, hsv) => latest.current.onMarkerChange?.(id, hsv),
            })
          : bindColorArea(element.current!, store, view),
      [store, view, multi],
    );
    return (
      <SurfaceContext.Provider value={view}>
        <div
          role="group"
          aria-label={
            view === 'wheel'
              ? 'Hue and saturation'
              : 'Saturation and brightness'
          }
          {...attributes}
          ref={(node) => {
            element.current = node;
            assignRef(forwarded, node);
          }}
          data-cp-part="surface"
          data-view={view}
          aria-disabled={state.disabled}
          tabIndex={state.disabled ? -1 : (attributes.tabIndex ?? 0)}
          style={{
            ...surfaceStyles(multi ? { ...state, v: 100 } : state, view),
            ...style,
          }}
        >
          {children}
        </div>
      </SurfaceContext.Provider>
    );
  },
);
export const ColorWheelSurface = forwardRef<
  HTMLDivElement,
  Omit<ColorPlaneProps, 'view'>
>(function ColorWheelSurface(props, ref) {
  return <ColorPlane {...props} view="wheel" ref={ref} />;
});
export const ColorThumb = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function ColorThumb({ style, ...attributes }, ref) {
  const state = useColor(),
    view = useContext(SurfaceContext);
  return (
    <span
      {...attributes}
      ref={ref}
      data-cp-part="thumb"
      aria-hidden="true"
      style={{ ...thumbPosition(state, view), ...style }}
    />
  );
});
export const ColorMarkerThumb = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { marker: Marker; active?: boolean }
>(function ColorMarkerThumb(
  { marker, active = false, style, children, disabled, ...attributes },
  ref,
) {
  const state = useColor();
  return (
    <button
      type="button"
      aria-label={marker.ariaLabel ?? marker.id}
      {...attributes}
      ref={ref}
      disabled={disabled || state.disabled}
      data-cp-part="marker"
      data-marker-id={marker.id}
      aria-pressed={active}
      data-state={active ? 'active' : 'inactive'}
      data-small={!marker.label || undefined}
      style={{
        ...thumbPosition(marker.color, 'wheel'),
        pointerEvents: 'auto',
        background: marker.color.hex,
        zIndex: active ? 2 : 1,
        ...style,
      }}
    >
      {children ?? marker.label}
    </button>
  );
});
export const ColorRange = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> & {
    channel?: SliderChannel;
  }
>(function ColorRange(
  { channel = 'h', style, disabled, ...attributes },
  forwarded,
) {
  const store = useColorStore(),
    state = useColor(),
    element = useRef<HTMLInputElement | null>(null);
  useEffect(
    () => bindColorSlider(element.current!, store, channel, () => !!disabled),
    [store, channel, disabled],
  );
  return (
    <input
      aria-label={sliderLabels[channel]}
      {...attributes}
      {...sliderAttributes(state, channel)}
      disabled={disabled || state.disabled}
      data-cp-part="slider"
      data-channel={channel}
      ref={(node) => {
        element.current = node;
        assignRef(forwarded, node);
      }}
      style={{ ...sliderTrackVariables(state), ...style }}
      onChange={attributes.onChange ?? (() => {})}
    />
  );
});
export const ColorField = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> &
    ColorInputOptions
>(function ColorField({ format, index, disabled, ...attributes }, forwarded) {
  const store = useColorStore(),
    state = useColor(),
    element = useRef<HTMLInputElement | null>(null);
  useEffect(
    () =>
      bindColorValueInput(
        element.current!,
        store,
        { format, index },
        () => !!disabled,
      ),
    [store, format, index, disabled],
  );
  const defaults = colorInputAttributes(state, { format, index });
  return (
    <input
      {...defaults}
      {...attributes}
      defaultValue={defaults.value}
      value={undefined}
      disabled={disabled || state.disabled}
      data-cp-part="input"
      spellCheck={false}
      ref={(node) => {
        element.current = node;
        assignRef(forwarded, node);
      }}
    />
  );
});
export const ColorFormatTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    format?: ColorFormat;
    render?: (state: ColorSnapshot) => ReactNode;
  }
>(function ColorFormatTrigger(
  { format, render, children, onClick, disabled, ...attributes },
  ref,
) {
  const store = useColorStore(),
    state = useColor();
  return (
    <button
      type="button"
      aria-label="Change color format"
      {...attributes}
      ref={ref}
      disabled={disabled || state.disabled}
      data-cp-part="format-trigger"
      aria-pressed={format ? state.format === format : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) nextColorFormat(store, format);
      }}
    >
      {render ? render(state) : (children ?? state.format.toUpperCase())}
    </button>
  );
});
export const ColorPicker = {
  Root: ColorRoot,
  Area: ColorPlane,
  Wheel: ColorWheelSurface,
  Thumb: ColorThumb,
  Marker: ColorMarkerThumb,
  Slider: ColorRange,
  Input: ColorField,
  ChannelInput: ColorField,
  FormatTrigger: ColorFormatTrigger,
};
