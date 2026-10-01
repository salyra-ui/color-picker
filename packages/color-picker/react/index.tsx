'use client';
export * from '../core';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type CSSProperties,
} from 'react';
import {
  colorViews,
  type ColorCollectionStore,
  type ColorCollectionClasses,
  type ColorView,
  bindMarkerWheel,
  markerWheelStyle,
  markerStyle,
  bindAlphaInput,
  sliderLabels,
  sliderValue,
  setSliderValue,
  type ColorMarker,
  type ColorPartClasses,
  type SliderChannel,
  type HSV,
  channelSpecs,
  wheelStyle,
  wheelThumbStyle,
  channelValue,
  setColorChannel,
  type ChannelFormat,
  type ChannelIndex,
  colorFormats,
  subscribeColor,
  parseColor,
  formatColor,
  type ColorFormat,
  bindColorArea,
  createColorStore,
  type ColorStore,
} from '../core';
const Context = createContext<ColorStore | null>(null);
export function useColorStore() {
  const store = useContext(Context);
  if (!store) throw new Error('Color components require ColorProvider');
  return store;
}
export function useColor() {
  const store = useColorStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
export function ColorProvider({
  value,
  view = 'area',
  onChange,
  children,
  disabled,
  store: provided,
}: {
  value?: string;
  disabled?: boolean;
  view?: ColorView;
  onChange?: (hex: string) => void;
  children: ReactNode;
  store?: ColorStore;
}) {
  const [store] = useState(() => {
    const initial = provided ?? createColorStore(value, 'hex', view, disabled);
    if (disabled !== undefined) initial.setDisabled(disabled);
    return initial;
  });
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  useEffect(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  }, [store, disabled]);
  const callback = useRef(onChange);
  callback.current = onChange;
  useEffect(() => {
    if (value !== undefined) store.setHex(value);
  }, [store, value]);
  useEffect(
    () => subscribeColor(store, (hex) => callback.current?.(hex)),
    [store],
  );
  return (
    <Context.Provider value={store}>
      <fieldset
        className="cp-provider-controls"
        disabled={state.disabled}
        {...(state.disabled ? { inert: '' } : {})}
        aria-disabled={state.disabled}
        data-disabled={state.disabled}
      >
        {children}
      </fieldset>
    </Context.Provider>
  );
}
export function ColorArea({
  className = '',
  style,
  classes = {},
  thumbText,
  renderThumb,
  label = 'Saturation and brightness',
}: {
  className?: string;
  style?: CSSProperties;
  classes?: ColorPartClasses;
  thumbText?: ReactNode;
  renderThumb?: (state: ReturnType<ColorStore['getSnapshot']>) => ReactNode;
  label?: string;
}) {
  const store = useColorStore(),
    state = useColor(),
    ref = useRef<HTMLDivElement>(null);
  useEffect(() => bindColorArea(ref.current!, store), [store]);
  return (
    <div
      ref={ref}
      className={`cp-area ${className} ${classes.root ?? ''}`}
      data-cp-part="surface"
      role="group"
      tabIndex={0}
      aria-label={`${label}. Arrow keys adjust; Shift for larger steps. ${Math.round(state.s)}% saturation, ${Math.round(state.v)}% brightness.`}
      style={{
        position: 'relative',
        touchAction: 'none',
        minWidth: 160,
        minHeight: 120,
        background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl(${state.h} 100% 50%)`,
        ...style,
      }}
    >
      <span
        data-cp-part="thumb"
        className={classes.thumb}
        aria-hidden
        style={{
          position: 'absolute',
          left: `${state.s}%`,
          top: `${100 - state.v}%`,
          transform: 'translate(-50%,-50%)',
          width: 'var(--cp-thumb-size,12px)',
          height: 'var(--cp-thumb-size,12px)',
          border: 'var(--cp-thumb-border,2px solid white)',
          boxShadow: 'var(--cp-thumb-shadow,0 0 0 1px #000)',
          borderRadius: 'var(--cp-thumb-radius,50%)',
          pointerEvents: 'none',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span data-cp-part="thumb-text" className={classes.text}>
          {renderThumb ? renderThumb(state) : thumbText}
        </span>
      </span>
    </div>
  );
}
export function ColorSlider({
  channel = 'h',
  label,
  className = '',
  classes = {},
}: {
  channel?: SliderChannel;
  label?: string;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const store = useColorStore(),
    state = useColor();
  return (
    <label
      className={`cp-slider ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
      style={{ '--cp-alpha-color': state.hex } as CSSProperties}
      data-cp-part="slider"
      data-channel={channel}
    >
      {label ?? sliderLabels[channel]}
      <input
        type="range"
        data-cp-part="track"
        className={`${classes.track ?? ''} ${classes.input ?? ''}`}
        min={0}
        max={channel === 'h' ? 359 : 100}
        step={1}
        value={sliderValue(state, channel)}
        onChange={(e) => setSliderValue(store, channel, Number(e.target.value))}
      />
    </label>
  );
}
export function ColorTextInput({
  format: override,
  label,
  className = '',
  classes = {},
}: {
  format?: ColorFormat;
  label?: string;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const store = useColorStore(),
    state = useColor(),
    format = override ?? state.format,
    focused = useRef(false),
    [draft, setDraft] = useState(() =>
      formatColor(state.hex, format, state.alpha),
    ),
    [invalid, setInvalid] = useState(false);
  useEffect(() => {
    if (!focused.current) {
      setDraft(formatColor(state.hex, format, state.alpha));
      setInvalid(false);
    }
  }, [state.hex, state.alpha, format]);
  const reset = () => {
    setDraft(
      formatColor(store.getSnapshot().hex, format, store.getSnapshot().alpha),
    );
    setInvalid(false);
  };
  return (
    <label
      className={`cp-input ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
    >
      {label ?? format.toUpperCase()}
      <input
        data-cp-part="input"
        className={classes.input}
        value={draft}
        spellCheck={false}
        maxLength={format === 'hex' ? 9 : 64}
        aria-invalid={invalid}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => {
          const text = e.target.value;
          setDraft(text);
          try {
            store.setHex(parseColor(text, format));
            setInvalid(false);
          } catch {
            setInvalid(true);
          }
        }}
        onBlur={() => {
          focused.current = false;
          reset();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') reset();
        }}
      />
    </label>
  );
}
export function ColorSwatch({
  value,
  label = value,
  className = '',
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const store = useColorStore();
  return (
    <button
      type="button"
      className={`cp-swatch ${className}`}
      aria-label={label}
      style={{ background: value }}
      onClick={() => store.setHex(value)}
    />
  );
}
export function ColorPreview({ className = '' }: { className?: string }) {
  const state = useColor();
  return (
    <output
      className={`cp-preview ${className}`}
      style={{ background: state.value }}
      aria-label={`Selected color ${state.value}`}
    >
      {state.value}
    </output>
  );
}

export function ColorMode({
  className = '',
  children,
}: {
  className?: string;
  children?: ReactNode | ((format: ColorFormat) => ReactNode);
}) {
  const store = useColorStore(),
    state = useColor();
  return (
    <button
      type="button"
      className={`cp-mode ${className}`}
      aria-label={`Next color format (${state.format.toUpperCase()})`}
      onClick={() =>
        store.setFormat(
          colorFormats[
            (colorFormats.indexOf(state.format) + 1) % colorFormats.length
          ],
        )
      }
    >
      {typeof children === 'function'
        ? children(state.format)
        : (children ?? `${state.format.toUpperCase()} ↔`)}
    </button>
  );
}
export function ColorFormatSelect({
  label = 'Color format',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const store = useColorStore(),
    state = useColor();
  return (
    <label className={`cp-format ${className}`}>
      {label}
      <select
        data-cp-part="select"
        value={state.format}
        onChange={(e) => store.setFormat(e.target.value as ColorFormat)}
      >
        {colorFormats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ColorChannelInput({
  format,
  index,
  className = '',
  classes = {},
}: {
  format: ChannelFormat;
  index: ChannelIndex;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const store = useColorStore(),
    state = useColor(),
    spec = channelSpecs[format][index],
    focused = useRef(false);
  const [draft, setDraft] = useState(() => channelValue(state, format, index)),
    [invalid, setInvalid] = useState(false);
  useEffect(() => {
    if (!focused.current) {
      setDraft(channelValue(state, format, index));
      setInvalid(false);
    }
  }, [state, format, index]);
  const reset = () => {
    setDraft(channelValue(store.getSnapshot(), format, index));
    setInvalid(false);
  };
  return (
    <label
      className={`cp-channel ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
    >
      <span className={classes.text}>{spec.label}</span>
      <span className="cp-channel-field">
        <input
          data-cp-part="input"
          className={classes.input}
          type="number"
          aria-label={`${format.toUpperCase()} ${spec.label}`}
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={draft}
          aria-invalid={invalid}
          onFocus={() => {
            focused.current = true;
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            try {
              if (!raw.trim()) throw new Error('Incomplete');
              setColorChannel(store, format, index, Number(raw));
              setInvalid(false);
            } catch {
              setInvalid(true);
            }
          }}
          onBlur={() => {
            focused.current = false;
            reset();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') reset();
          }}
        />
        <span aria-hidden>{spec.unit}</span>
      </span>
    </label>
  );
}
export function ColorInput({
  format: override,
  label,
  className = '',
  classes = {},
}: {
  format?: ColorFormat;
  label?: string;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const state = useColor(),
    format = override ?? state.format;
  return format === 'hex' ? (
    <ColorTextInput
      format="hex"
      label={label ?? 'HEX'}
      className={className}
      classes={classes}
    />
  ) : (
    <div
      className={`cp-channels ${className}`}
      role="group"
      aria-label={label ?? format.toUpperCase()}
    >
      {([0, 1, 2] as const).map((index) => (
        <ColorChannelInput
          key={`${format}-${index}`}
          classes={classes}
          format={format}
          index={index}
        />
      ))}
    </div>
  );
}

/** Hue/saturation wheel; pair with ColorSlider channel="v" for brightness. */
export function ColorWheel({
  className = '',
  label = 'Hue and saturation wheel',
  classes = {},
  thumbText,
  markers,
  activeId,
  onSelect,
  onMarkerChange,
  renderMarker,
  style: customStyle,
}: {
  className?: string;
  label?: string;
  classes?: ColorPartClasses;
  thumbText?: ReactNode;
  markers?: readonly ColorMarker[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onMarkerChange?: (id: string, hsv: Partial<HSV>) => void;
  renderMarker?: (marker: ColorMarker, active: boolean) => ReactNode;
  style?: CSSProperties;
}) {
  const store = useColorStore(),
    state = useColor(),
    ref = useRef<HTMLDivElement>(null),
    latest = useRef({ markers, activeId, onSelect, onMarkerChange });
  latest.current = { markers, activeId, onSelect, onMarkerChange };
  const multi = markers !== undefined;
  useEffect(
    () =>
      multi
        ? bindMarkerWheel(ref.current!, {
            getMarkers: () => latest.current.markers ?? [],
            getActiveId: () =>
              latest.current.activeId ?? latest.current.markers?.[0]?.id ?? '',
            select: (id) => latest.current.onSelect?.(id),
            setHSV: (id, hsv) => latest.current.onMarkerChange?.(id, hsv),
          })
        : bindColorArea(ref.current!, store, 'wheel'),
    [store, multi],
  );
  const css = (text: string) =>
    Object.fromEntries(
      text.split(';').map((part) => {
        const i = part.indexOf(':');
        return [
          part.slice(0, i).replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
          part.slice(i + 1),
        ];
      }),
    ) as CSSProperties;
  return (
    <div
      ref={ref}
      data-cp-part="surface"
      className={`cp-wheel ${className} ${classes.root ?? ''}`}
      role="group"
      tabIndex={0}
      aria-label={label}
      style={{
        ...css(multi ? markerWheelStyle() : wheelStyle(state)),
        ...customStyle,
      }}
    >
      {markers ? (
        markers.map((marker) => (
          <button
            key={marker.id}
            type="button"
            data-cp-part="marker"
            data-marker-id={marker.id}
            data-small={
              markers.length === 1 || !marker.label ? 'true' : undefined
            }
            className={`cp-wheel-marker ${classes.marker ?? ''}`}
            aria-label={marker.ariaLabel ?? `Select ${marker.id} marker`}
            aria-pressed={activeId === marker.id}
            style={css(markerStyle(marker, activeId === marker.id))}
          >
            <span data-cp-part="marker-text" className={classes.text}>
              {renderMarker
                ? renderMarker(marker, activeId === marker.id)
                : marker.label}
            </span>
          </button>
        ))
      ) : (
        <span
          data-cp-part="thumb"
          aria-hidden
          className={classes.thumb}
          style={css(wheelThumbStyle(state))}
        >
          <span data-cp-part="thumb-text" className={classes.text}>
            {thumbText}
          </span>
        </span>
      )}
    </div>
  );
}

export function ColorViewSelect({
  label = 'Picker view',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const store = useColorStore(),
    state = useColor();
  return (
    <label className={`cp-format ${className}`}>
      {label}
      <select
        data-cp-part="select"
        value={state.view}
        onChange={(e) => store.setView(e.target.value as ColorView)}
      >
        {colorViews.map((view) => (
          <option key={view} value={view}>
            {view === 'area' ? 'Rectangle' : 'Wheel'}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ColorSurface() {
  const state = useColor();
  return (
    <>
      {state.view === 'wheel' ? <ColorWheel /> : <ColorArea />}
      <ColorSlider channel={state.view === 'wheel' ? 'v' : 'h'} />
    </>
  );
}

export function ColorAlphaInput({
  label = 'Alpha',
  className = '',
  classes = {},
}: {
  label?: string;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const store = useColorStore(),
    ref = useRef<HTMLInputElement>(null);
  useEffect(() => bindAlphaInput(ref.current!, store), [store]);
  return (
    <label
      className={`cp-alpha-input cp-channel ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
      data-cp-part="alpha-input"
    >
      {label}
      <span className="cp-channel-field">
        <input
          ref={ref}
          data-cp-part="input"
          className={classes.input}
          type="number"
          min={0}
          max={100}
          step={0.1}
          defaultValue={Number((store.getSnapshot().alpha * 100).toFixed(1))}
          aria-label={label}
        />
        <span>%</span>
      </span>
    </label>
  );
}

/** Recent or favorite colors, using the nearest color context. */
export function ColorCollection({
  collection,
  kind = 'recent',
  label = kind === 'recent' ? 'Recent colors' : 'Favorite colors',
  classes = {},
  renderLabel,
}: {
  collection: ColorCollectionStore;
  kind?: 'recent' | 'favorites';
  label?: string;
  classes?: ColorCollectionClasses;
  renderLabel?: (color: string) => ReactNode;
}) {
  const store = useColorStore(),
    color = useColor();
  const state = useSyncExternalStore(
    collection.subscribe,
    collection.getSnapshot,
    collection.getSnapshot,
  );
  return (
    <fieldset
      className={`cp-collection ${classes.root ?? ''}`}
      disabled={color.disabled}
    >
      <legend className={classes.label}>{label}</legend>
      {state[kind].map((value) => (
        <button
          key={value}
          type="button"
          className={`cp-swatch ${classes.item ?? ''}`}
          style={{ background: value }}
          aria-label={value}
          onClick={() => store.setHex(value)}
        >
          {renderLabel?.(value)}
        </button>
      ))}
    </fieldset>
  );
}
