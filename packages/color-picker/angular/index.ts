export * from '../core';
import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  DestroyRef,
  afterNextRender,
  afterRenderEffect,
  ViewChild,
  ElementRef,
  type OnInit,
  type OnChanges,
} from '@angular/core';
import {
  colorViews,
  type ColorView,
  bindMarkerWheel,
  markerWheelStyle,
  markerStyle,
  bindAlphaInput,
  sliderLabels,
  sliderValue,
  setSliderValue,
  alphaTrackStyle,
  type ColorMarker,
  type ColorPartClasses,
  type SliderChannel,
  type HSV,
  channelSpecs,
  channelValue,
  setColorChannel,
  type ChannelFormat,
  type ChannelIndex,
  colorFormats,
  subscribeColor,
  parseColor,
  formatColor,
  type ColorFormat,
  areaStyle,
  wheelStyle,
  wheelThumbStyle,
  thumbStyle,
  bindColorArea,
  createColorStore,
  type ColorStore,
} from '../core';
@Injectable()
export class ColorContext {
  private current = createColorStore();
  private listeners = new Set<() => void>();
  private forward = () => this.listeners.forEach((fn) => fn());
  private unsubscribe = this.current.subscribe(this.forward);
  readonly store: ColorStore = {
    getColor: () => this.current.getColor(),
    getValue: (format) => this.current.getValue(format),
    getSnapshot: () => this.current.getSnapshot(),
    getServerSnapshot: () => this.current.getServerSnapshot(),
    subscribe: (fn) => {
      this.listeners.add(fn);
      return () => {
        this.listeners.delete(fn);
      };
    },
    setView: (view) => this.current.setView(view),
    setFormat: (format) => this.current.setFormat(format),
    setAlpha: (alpha) => this.current.setAlpha(alpha),
    setHex: (hex) => this.current.setHex(hex),
    setHSV: (hsv) => this.current.setHSV(hsv),
  };
  constructor() {
    inject(DestroyRef).onDestroy(() => this.unsubscribe());
  }
  configure(store: ColorStore) {
    this.unsubscribe();
    this.current = store;
    this.unsubscribe = store.subscribe(this.forward);
    this.forward();
  }
}
export function useColorStore() {
  return inject(ColorContext).store;
}
export function useColor() {
  const store = useColorStore(),
    state = signal(store.getSnapshot());
  inject(DestroyRef).onDestroy(
    store.subscribe(() => state.set(store.getSnapshot())),
  );
  return state.asReadonly();
}
@Component({
  selector: 'cp-provider',
  standalone: true,
  providers: [ColorContext],
  template: '<ng-content />',
})
export class ColorProvider implements OnInit, OnChanges {
  @Input() value?: string;
  @Input() view: ColorView = 'area';
  @Input() store?: ColorStore;
  @Output() colorChange = new EventEmitter<string>();
  private context = inject(ColorContext);
  private destroyRef = inject(DestroyRef);
  ngOnInit() {
    this.context.configure(
      this.store ?? createColorStore(this.value, 'hex', this.view),
    );
    this.destroyRef.onDestroy(
      subscribeColor(this.context.store, (hex) => this.colorChange.emit(hex)),
    );
  }
  ngOnChanges() {
    if (this.value !== undefined) this.context.store.setHex(this.value);
  }
}
@Component({
  selector: 'cp-area',
  standalone: true,
  template: `<div
    #area
    data-cp-part="surface"
    [class]="'cp-area ' + className + ' ' + (classes.root ?? '')"
    role="group"
    tabindex="0"
    [attr.aria-label]="
      label +
      '. Arrow keys adjust; Shift for larger steps. ' +
      state().s.toFixed(0) +
      '% saturation, ' +
      state().v.toFixed(0) +
      '% brightness.'
    "
    [style]="areaStyle(state())"
  >
    <span
      data-cp-part="thumb"
      [class]="classes.thumb ?? ''"
      aria-hidden="true"
      [style]="thumbStyle(state())"
      ><span data-cp-part="thumb-text" [class]="classes.text ?? ''"
        >{{ thumbText }}<ng-content select="[cpThumb]" /></span
    ></span>
  </div>`,
})
export class ColorArea {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() thumbText = '';
  @Input() label = 'Saturation and brightness';
  @ViewChild('area') area!: ElementRef<HTMLElement>;
  readonly store = useColorStore();
  readonly state = useColor();
  readonly areaStyle = areaStyle;
  readonly thumbStyle = thumbStyle;
  constructor() {
    let cleanup: (() => void) | undefined;
    afterNextRender(() => {
      cleanup = bindColorArea(this.area.nativeElement, this.store);
    });
    inject(DestroyRef).onDestroy(() => cleanup?.());
  }
}
@Component({
  selector: 'cp-wheel',
  standalone: true,
  template: `<div
    #area
    data-cp-part="surface"
    [class]="'cp-wheel ' + className + ' ' + (classes.root ?? '')"
    role="group"
    tabindex="0"
    [attr.aria-label]="label"
    [style]="markers ? markerWheelStyle() : wheelStyle(state())"
  >
    @if (markers) {
      @for (marker of markers; track marker.id) {
        <button
          type="button"
          data-cp-part="marker"
          [attr.data-marker-id]="marker.id"
          [attr.data-small]="
            markers.length === 1 || !marker.label ? 'true' : null
          "
          [class]="'cp-wheel-marker ' + (classes.marker ?? '')"
          [attr.aria-label]="
            marker.ariaLabel ?? 'Select ' + marker.id + ' marker'
          "
          [attr.aria-pressed]="activeId === marker.id"
          [style]="markerStyle(marker, activeId === marker.id)"
        >
          <span data-cp-part="marker-text" [class]="classes.text ?? ''">{{
            marker.label ?? ''
          }}</span>
        </button>
      }
    } @else {
      <span
        data-cp-part="thumb"
        aria-hidden="true"
        [class]="classes.thumb ?? ''"
        [style]="wheelThumbStyle(state())"
        ><span data-cp-part="thumb-text" [class]="classes.text ?? ''">{{
          thumbText
        }}</span></span
      >
    }
  </div>`,
})
export class ColorWheel {
  @Input() label = 'Hue and saturation wheel';
  @Input() className = '';
  @Input() classes: ColorPartClasses = {};
  @Input() thumbText = '';
  @Input() markers?: readonly ColorMarker[];
  @Input() activeId?: string;
  @Output() markerSelect = new EventEmitter<string>();
  @Output() markerChange = new EventEmitter<{
    id: string;
    hsv: Partial<HSV>;
  }>();
  @ViewChild('area') area!: ElementRef<HTMLElement>;
  readonly store = useColorStore();
  readonly state = useColor();
  readonly wheelStyle = wheelStyle;
  readonly wheelThumbStyle = wheelThumbStyle;
  readonly markerWheelStyle = markerWheelStyle;
  readonly markerStyle = markerStyle;
  constructor() {
    let cleanup: (() => void) | undefined;
    afterNextRender(() => {
      cleanup = this.markers
        ? bindMarkerWheel(this.area.nativeElement, {
            getMarkers: () => this.markers ?? [],
            getActiveId: () => this.activeId ?? this.markers?.[0]?.id ?? '',
            select: (id) => this.markerSelect.emit(id),
            setHSV: (id, hsv) => this.markerChange.emit({ id, hsv }),
          })
        : bindColorArea(this.area.nativeElement, this.store, 'wheel');
    });
    inject(DestroyRef).onDestroy(() => cleanup?.());
  }
}
@Component({
  selector: 'cp-slider',
  standalone: true,
  template: `<label
    data-cp-part="slider"
    [class]="
      'cp-slider ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
    [style]="alphaTrackStyle(state().hex)"
    [attr.data-channel]="channel"
    >{{ label || labels[channel]
    }}<input
      data-cp-part="track"
      [class]="(classes.track ?? '') + ' ' + (classes.input ?? '')"
      type="range"
      min="0"
      [max]="channel === 'h' ? 359 : 100"
      step="1"
      [value]="sliderValue(state(), channel)"
      (input)="change($event)"
  /></label>`,
})
export class ColorSlider {
  @Input() channel: SliderChannel = 'h';
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() label = '';
  readonly labels = sliderLabels;
  readonly sliderValue = sliderValue;
  readonly alphaTrackStyle = alphaTrackStyle;
  readonly store = useColorStore();
  readonly state = useColor();
  change(event: Event) {
    setSliderValue(
      this.store,
      this.channel,
      Number((event.target as HTMLInputElement).value),
    );
  }
}
@Component({
  selector: 'cp-text-input',
  standalone: true,
  template: `<label
    [class]="
      'cp-input ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
    >{{ label || selectedFormat().toUpperCase()
    }}<input
      data-cp-part="input"
      [class]="classes.input ?? ''"
      [value]="draft()"
      spellcheck="false"
      [attr.maxlength]="selectedFormat() === 'hex' ? 9 : 64"
      [attr.aria-invalid]="invalid()"
      (input)="change($event)"
      (focus)="focused = true"
      (blur)="focused = false; reset()"
      (keydown.enter)="reset()"
  /></label>`,
})
export class ColorTextInput {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() label = '';
  @Input() format?: ColorFormat;
  readonly state = useColor();
  selectedFormat() {
    return this.format ?? this.state().format;
  }
  focused = false;
  readonly store = useColorStore();
  readonly draft = signal(this.store.getSnapshot().hex);
  readonly invalid = signal(false);
  ngOnChanges() {
    this.reset();
  }
  constructor() {
    inject(DestroyRef).onDestroy(
      this.store.subscribe(() => {
        if (!this.focused) this.reset();
      }),
    );
  }
  change(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.draft.set(value);
    try {
      this.store.setHex(parseColor(value, this.selectedFormat()));
      this.invalid.set(false);
    } catch {
      this.invalid.set(true);
    }
  }
  reset() {
    this.draft.set(
      formatColor(
        this.store.getSnapshot().hex,
        this.selectedFormat(),
        this.store.getSnapshot().alpha,
      ),
    );
    this.invalid.set(false);
  }
}
@Component({
  selector: 'cp-swatch',
  standalone: true,
  template: `<button
    type="button"
    class="cp-swatch"
    [attr.aria-label]="label || value"
    [style.background]="value"
    (click)="store.setHex(value)"
  ></button>`,
})
export class ColorSwatch {
  @Input() value = '#6366F1';
  @Input() label = '';
  readonly store = useColorStore();
}
@Component({
  selector: 'cp-preview',
  standalone: true,
  template: `<output
    class="cp-preview"
    [style.background]="state().value"
    [attr.aria-label]="'Selected color ' + state().value"
    >{{ state().value }}</output
  >`,
})
export class ColorPreview {
  readonly state = useColor();
}

@Component({
  selector: 'cp-mode',
  standalone: true,
  template: `<button
    type="button"
    class="cp-mode"
    [attr.aria-label]="
      'Next color format (' + state().format.toUpperCase() + ')'
    "
    (click)="next()"
  >
    {{ state().format.toUpperCase() }} ↔
  </button>`,
})
export class ColorMode {
  readonly store = useColorStore();
  readonly state = useColor();
  next() {
    this.store.setFormat(
      colorFormats[
        (colorFormats.indexOf(this.state().format) + 1) % colorFormats.length
      ],
    );
  }
}
@Component({
  selector: 'cp-format-select',
  standalone: true,
  template: `<label class="cp-format"
    >{{ label
    }}<select #select (change)="change($event)">
      @for (format of formats; track format) {
        <option
          [value]="format"
          [attr.selected]="state().format === format ? '' : null"
        >
          {{ format.toUpperCase() }}
        </option>
      }
    </select></label
  >`,
})
export class ColorFormatSelect {
  @ViewChild('select') select!: ElementRef<HTMLSelectElement>;
  constructor() {
    afterRenderEffect(() => {
      this.select.nativeElement.value = this.state().format;
    });
  }
  @Input() label = 'Color format';
  readonly store = useColorStore();
  readonly state = useColor();
  readonly formats = colorFormats;
  change(event: Event) {
    this.store.setFormat(
      (event.target as HTMLSelectElement).value as ColorFormat,
    );
  }
}

@Component({
  selector: 'cp-channel-input',
  standalone: true,
  template: `<label
    [class]="
      'cp-channel ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
    ><span>{{ spec().label }}</span
    ><span class="cp-channel-field"
      ><input
        data-cp-part="input"
        [class]="classes.input ?? ''"
        type="number"
        [attr.aria-label]="format.toUpperCase() + ' ' + spec().label"
        [min]="spec().min"
        [max]="spec().max"
        [step]="spec().step"
        [value]="draft()"
        [attr.aria-invalid]="invalid()"
        (focus)="focused = true"
        (input)="change($event)"
        (blur)="focused = false; reset()"
        (keydown.enter)="reset()"
      /><span aria-hidden="true">{{ spec().unit }}</span></span
    ></label
  >`,
})
export class ColorChannelInput implements OnChanges {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() format: ChannelFormat = 'rgb';
  @Input() index: ChannelIndex = 0;
  readonly store = useColorStore();
  readonly draft = signal(channelValue(this.store.getSnapshot(), 'rgb', 0));
  readonly invalid = signal(false);
  focused = false;
  constructor() {
    inject(DestroyRef).onDestroy(
      this.store.subscribe(() => {
        if (!this.focused) this.reset();
      }),
    );
  }
  spec() {
    return channelSpecs[this.format][this.index];
  }
  ngOnChanges() {
    this.reset();
  }
  change(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    this.draft.set(raw);
    try {
      if (!raw.trim()) throw new Error('Incomplete');
      setColorChannel(this.store, this.format, this.index, Number(raw));
      this.invalid.set(false);
    } catch {
      this.invalid.set(true);
    }
  }
  reset() {
    this.draft.set(
      channelValue(this.store.getSnapshot(), this.format, this.index),
    );
    this.invalid.set(false);
  }
}
@Component({
  selector: 'cp-input',
  standalone: true,
  imports: [ColorTextInput, ColorChannelInput],
  template: `@if (selectedFormat() === 'hex') {
      <cp-text-input
        format="hex"
        [classes]="classes"
        [className]="className"
        [label]="label || 'HEX'"
      />
    } @else {
      <div
        class="cp-channels"
        role="group"
        [attr.aria-label]="label || selectedFormat().toUpperCase()"
      >
        @for (index of indices; track index) {
          <cp-channel-input
            [classes]="classes"
            [className]="className"
            [format]="channelFormat()"
            [index]="index"
          />
        }
      </div>
    }`,
})
export class ColorInput {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() format?: ColorFormat;
  @Input() label = '';
  readonly state = useColor();
  readonly indices: ChannelIndex[] = [0, 1, 2];
  selectedFormat() {
    return this.format ?? this.state().format;
  }
  channelFormat() {
    return this.selectedFormat() as ChannelFormat;
  }
}

@Component({
  selector: 'cp-view-select',
  standalone: true,
  template: `<label class="cp-format"
    >{{ label
    }}<select #select (change)="change($event)">
      @for (view of views; track view) {
        <option
          [value]="view"
          [attr.selected]="state().view === view ? '' : null"
        >
          {{ view === 'area' ? 'Rectangle' : 'Wheel' }}
        </option>
      }
    </select></label
  >`,
})
export class ColorViewSelect {
  @ViewChild('select') select!: ElementRef<HTMLSelectElement>;
  constructor() {
    afterRenderEffect(() => {
      this.select.nativeElement.value = this.state().view;
    });
  }
  @Input() label = 'Picker view';
  readonly store = useColorStore();
  readonly state = useColor();
  readonly views = colorViews;
  change(event: Event) {
    this.store.setView((event.target as HTMLSelectElement).value as ColorView);
  }
}

@Component({
  selector: 'cp-surface',
  standalone: true,
  imports: [ColorArea, ColorWheel, ColorSlider],
  template: `@if (state().view === 'wheel') {
      <cp-wheel />
    } @else {
      <cp-area />
    }
    <cp-slider [channel]="state().view === 'wheel' ? 'v' : 'h'" />`,
})
export class ColorSurface {
  readonly state = useColor();
}

@Component({
  selector: 'cp-alpha-input',
  standalone: true,
  template: `<label
    data-cp-part="alpha-input"
    [class]="
      'cp-alpha-input cp-channel ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
    >{{ label
    }}<span class="cp-channel-field"
      ><input
        #input
        data-cp-part="input"
        [class]="classes.input ?? ''"
        type="number"
        min="0"
        max="100"
        step="0.1"
        [attr.value]="initial"
        [attr.aria-label]="label"
      /><span>%</span></span
    ></label
  >`,
})
export class ColorAlphaInput {
  @Input() label = 'Alpha';
  @Input() className = '';
  @Input() classes: ColorPartClasses = {};
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  readonly store = useColorStore();
  readonly state = useColor();
  get initial() {
    return Number((this.state().alpha * 100).toFixed(4));
  }
  constructor() {
    let cleanup: (() => void) | undefined;
    afterNextRender(
      () => (cleanup = bindAlphaInput(this.input.nativeElement, this.store)),
    );
    inject(DestroyRef).onDestroy(() => cleanup?.());
  }
}
